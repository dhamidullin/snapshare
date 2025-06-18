'use client'

import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from './components/Header';
import Toggle from './components/Toggle';
import UploadedLinks from './components/UploadedLinks';
import { copyToClipboard } from './helpers/clipboard';
import { settingsService } from './services/settingsService';

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  flex: 0 0 auto;
`;

const ContentContainer = styled.div`
  padding: 2rem;
  display: flex;
  gap: 2rem;
  flex: 1 0 auto;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`;

const Sidebar = styled.aside`
  width: 300px;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const SettingItem = styled.div`
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const DropZone = styled.div<{ $isDragging: boolean }>`
  width: 100%;
  max-width: 600px;
  height: 300px;
  border: 2px dashed ${props => props.$isDragging ? '#2196f3' : '#ccc'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isDragging ? 'rgba(33, 150, 243, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #2196f3;
    background-color: rgba(33, 150, 243, 0.05);
  }
`;

const DropText = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 1rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  text-align: center;
`;

const DropZoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 2rem;
`;

interface UseFileUploadReturn {
  isDragging: boolean;
  error: string | null;
  autoCopy: boolean;
  showPreview: boolean;
  uploadedLinks: string[];
  setAutoCopy: (value: boolean) => void;
  setShowPreview: (value: boolean) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const useFileUpload = (): UseFileUploadReturn => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoCopy, setAutoCopy] = useState(() => settingsService.getAutoCopy());
  const [showPreview, setShowPreview] = useState(() => settingsService.getShowPreview());
  const [uploadedLinks, setUploadedLinks] = useState<string[]>(() => settingsService.getUploadedLinks());
  const router = useRouter();

  // Save settings when they change
  useEffect(() => {
    settingsService.setAutoCopy(autoCopy);
  }, [autoCopy]);

  useEffect(() => {
    settingsService.setShowPreview(showPreview);
  }, [showPreview]);

  const getPassword = useCallback(async () => {
    let password = settingsService.getPassword();
    if (!password) {
      password = window.prompt('Please enter the password:');
      if (password) {
        settingsService.setPassword(password);
      }
    }
    return password;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    const password = await getPassword();
    if (!password) {
      setError('Password is required');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
      const { data } = await axios.post('/api/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        const fileUrl = `${window.location.origin}/api/file/${data.filename}`;

        // Store the link and update state
        settingsService.addUploadedLink(fileUrl);
        setUploadedLinks(settingsService.getUploadedLinks());

        if (autoCopy) {
          await copyToClipboard(fileUrl);
        }

        if (showPreview) {
          router.push(`/file/${data.filename}`);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      // Clear stored password on auth error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        settingsService.clearPassword();
      }

      console.error('Upload failed:', error);
      setError(
        error instanceof Error
          ? error.message
          : axios.isAxiosError(error) && error.response?.data?.error
            ? error.response.data.error
            : 'Upload failed'
      );
    }
  }, [router, getPassword, autoCopy, showPreview]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          handleFile(file);
        }
      }
    }
  }, [handleFile]);

  // Add global paste handler
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return {
    isDragging,
    error,
    autoCopy,
    showPreview,
    uploadedLinks,
    setAutoCopy,
    setShowPreview,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
};

export default function Home() {
  const {
    isDragging,
    error,
    autoCopy,
    showPreview,
    uploadedLinks,
    setAutoCopy,
    setShowPreview,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  } = useFileUpload();

  return (
    <>
      <MainContent data-testid="main-content">
        <HeaderWrapper data-testid="header-wrapper">
          <Header />
        </HeaderWrapper>

        <ContentContainer data-testid="content-container">
          <Sidebar data-testid="settings-sidebar">
            <SidebarTitle>Upload Settings</SidebarTitle>

            <SettingItem data-testid="setting-auto-copy">
              <Toggle
                checked={autoCopy}
                onChange={setAutoCopy}
                label="Copy sharing link automatically"
              />
            </SettingItem>

            <SettingItem data-testid="setting-show-preview">
              <Toggle
                checked={showPreview}
                onChange={setShowPreview}
                label="Show preview after upload"
              />
            </SettingItem>
          </Sidebar>

          <ContentArea data-testid="content-area">
            <UploadedLinks links={uploadedLinks} />

            <DropZoneWrapper data-testid="drop-zone-wrapper">
              {error && <ErrorText data-testid="error-message">{error}</ErrorText>}
              <DropZone
                data-testid="drop-zone"
                $isDragging={isDragging}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <DropText data-testid="drop-zone-text">
                  Drag a file or paste from clipboard
                </DropText>
              </DropZone>
            </DropZoneWrapper>

            <Spacer data-testid="content-spacer" />
          </ContentArea>
        </ContentContainer>
      </MainContent>
    </>
  );
}

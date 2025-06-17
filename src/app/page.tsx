'use client'

import styled from 'styled-components';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from './components/Header';

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 64px); /* Subtract header height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
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

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // TODO: Temporary password management
  // SECURITY: This should be replaced with proper authentication system
  // - Implement proper session-based auth
  // - Add secure token storage
  // - Add proper login page
  const getPassword = useCallback(async () => {
    let password = localStorage.getItem('password');
    if (!password) {
      password = window.prompt('Please enter the password:');
      if (password) {
        localStorage.setItem('password', password);
      }
    }
    return password;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    // Get password from storage or prompt
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
        // Copy the file URL to clipboard
        const fileUrl = `${window.location.origin}/file/${data.filename}`;
        await navigator.clipboard.writeText(fileUrl);

        // Navigate to the file page
        router.push(`/file/${data.filename}`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      // Clear stored password on auth error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('password');
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
  }, [router, getPassword]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          handleFile(file);
        }
      }
    }
  }, [handleFile]);

  return (
    <>
      <Header />
      <MainContent>
        {error && <ErrorText>{error}</ErrorText>}
        <DropZone
          $isDragging={isDragging}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onPaste={onPaste}
        >
          <DropText>Drag a file or paste from clipboard</DropText>
        </DropZone>
      </MainContent>
    </>
  );
}

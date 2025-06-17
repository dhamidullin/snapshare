'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import styled from 'styled-components';

const MainContent = styled.main`
  min-height: calc(100vh - 64px);
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 4xl;
  margin: 0 auto;
`;

function isImage(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return imageExts.includes(ext);
}

export default function FilePage() {
  const params = useParams();
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    if (params.filename) {
      setFileUrl(`/api/file/${params.filename}`);
    }
  }, [params.filename]);

  return (
    <>
      <Header />
      <MainContent>
        <Container>
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          {fileUrl && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                <h1 className="text-xl font-semibold mb-4">
                  {params.filename}
                </h1>
              </a>

              {isImage(params.filename as string) && (
                <div className="mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={params.filename as string}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}

              <a
                href={fileUrl}
                download={params.filename as string}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download File
              </a>
            </div>
          )}
        </Container>
      </MainContent>
    </>
  );
} 
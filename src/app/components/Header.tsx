import styled from 'styled-components';

const HeaderWrapper = styled.header`
  width: 100%;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  display: flex;
  gap: 0.5rem;
`;

const Badge = styled.span`
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2196f3;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <TitleSection>
          <Title>SnapShare</Title>
          <Description>
            <Badge>pet project</Badge>
            Instant file sharing via drag-and-drop or clipboard paste
          </Description>
        </TitleSection>

        <GithubLink
          href="https://github.com/dhamidullin/snapshare"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          View on GitHub
        </GithubLink>
      </HeaderContent>
    </HeaderWrapper>
  );
} 
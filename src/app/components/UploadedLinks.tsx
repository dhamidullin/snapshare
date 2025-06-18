import styled from 'styled-components';
import { copyToClipboard } from '../helpers/clipboard';

interface UploadedLinksProps {
  links: string[];
}

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 105px;
  margin-bottom: 1rem;
`;

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
  
  /* Webkit browsers */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
    
    &:hover {
      background: #555;
    }
  }
`;

const ImageList = styled.div`
  display: inline-flex;
  gap: 1rem;
  padding: 0 1rem;
  height: 100%;
`;

const ImageWrapper = styled.div`
  height: 100%;
  min-width: 105px;
  max-width: 175px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

    .copy-button {
      opacity: 1;
    }
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 6px;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const NoImagesMessage = styled.div`
  width: 100%;
  text-align: center;
  color: #666;
  padding: 1rem;
  font-size: 0.95rem;
`;

export const UploadedLinks: React.FC<UploadedLinksProps> = ({ links }) => {
  const handleCopy = async (e: React.MouseEvent, link: string) => {
    e.preventDefault(); // Prevent opening the image in new tab
    await copyToClipboard(link);
  };

  if (!links.length) {
    return <NoImagesMessage>No uploaded images yet</NoImagesMessage>;
  }

  return (
    <CarouselWrapper data-testid="uploaded-links-carousel">
      <Container data-testid="carousel-container">
        <ImageList data-testid="image-list">
          {links.map((link, index) => (
            <ImageWrapper
              key={`${link}-${index}`}
              data-testid={`image-wrapper-${index}`}
            >
              <CopyButton
                className="copy-button"
                onClick={(e) => handleCopy(e, link)}
                data-testid={`copy-button-${index}`}
                title="Copy link to clipboard"
              >
                <img src="/file.svg" alt="Copy" />
              </CopyButton>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`image-link-${index}`}
              >
                <Image
                  src={link}
                  alt={`Uploaded image ${index + 1}`}
                  loading="lazy"
                  data-testid={`uploaded-image-${index}`}
                />
              </a>
            </ImageWrapper>
          ))}
        </ImageList>
      </Container>
    </CarouselWrapper>
  );
};

export default UploadedLinks; 
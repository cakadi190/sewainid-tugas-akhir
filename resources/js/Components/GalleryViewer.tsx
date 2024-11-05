import { MediaLibrary } from "@/types/medialibrary";
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const GalleryWrapper = styled.div<{ isWrap: boolean }>`
  gap: 1rem;
  border-radius: var(--bs-border-radius-xl);
  overflow-x: auto; /* Pastikan overflow-x di sini */

  ${({ isWrap }) => !isWrap ? `
    display: flex;
    max-width: 100%;
  ` : `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const PerfectScrollbarWrapper = styled(PerfectScrollbar)`
  display: flex;
  flex-direction: row;
  width: 100%;
  GAP: 1rem;
`;

const GalleryInner = styled.div<{ isWrap: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--bs-border-radius-xl);
  border: 1px solid rgba(var(--bs-body-color-rgb), .125);

  ${({ isWrap }) => !isWrap ? `
    aspect-ratio: 16 / 9;
    height: 250px;
    flex-shrink: 0;
  ` : `
    width: 150px;
    height: 150px;
  `}
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all .2s;

  &:hover {
    transform: scale(1.125);
  }
`;

export default function GalleryViewer({ data, wrap }: { data: MediaLibrary[]; wrap: boolean; }) {
  return (
    <GalleryWrapper isWrap={wrap} className="gallery-wrapper">
      <PerfectScrollbarWrapper
        options={{ suppressScrollY: true }}
      >
        {data.map((item, index) => (
          <GalleryInner key={index} isWrap={wrap}>
            <GalleryImage src={item.original_url} alt={item.name} />
          </GalleryInner>
        ))}
      </PerfectScrollbarWrapper>
    </GalleryWrapper>
  );
}

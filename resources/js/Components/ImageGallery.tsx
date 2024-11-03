import { MediaLibrary } from "@/types/medialibrary";
import styled from '@emotion/styled';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FsLightbox from "fslightbox-react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";

interface ImageGalleryInterface {
  initialData: MediaLibrary[];
}

const ImageGalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: .325rem;

  @media (width <= 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageGalleryWrap = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--bs-border-radius);
  border: 1px solid rgba(var(--bs-body-color-rgb), .125);
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all .2s;

  &:hover {
    transform: scale(1.25);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--bs-danger);
  color: white;
  border: none;
  border-radius: 0 0 0 var(--bs-border-radius-xl);
  width: 40px;
  height: 40px;
  display: flex;
  font-size: .925rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 10;
  cursor: pointer;
`;

export default function ImageGallery({ initialData }: ImageGalleryInterface) {
  const [data, setData] = useState<MediaLibrary[]>(initialData);
  const mappingToPreviewUrl = data.map((value) => ({
    id: value.id,
    name: value.name,
    url: value.original_url,
  }));
  const mappingToRealImageUrl = data.map((value) => ({
    id: value.id,
    url: value.original_url
  }));
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });

  function openLightboxOnSlide(target: number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: target
    });
  }

  function handleDelete(id: number) {
    withReactContent(Swal).fire({
      title: 'Apakah Kamu Yakin?',
      text: "Apakah kamu yakin akan menghapus media ini? Jika iya, maka aksi ini tidak dapat dikembalikan.",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      icon: 'warning',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        // Hapus item melalui API
        router.delete(route('v1.admin.medialibary-handler.delete', id), {
          onBefore() {
            withReactContent(Swal).fire({
              title: "Tunggu Sebentar",
              icon: "info",
              allowEscapeKey: false,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });
          },
          onSuccess() {
            withReactContent(Swal).fire({
              title: 'Berhasil!',
              text: "Berhasil menghapus media yang kamu pilih.",
              icon: 'success',
            })
            // Hapus item dari state data
            setData(prevData => prevData.filter(item => item.id !== id));
          },
          onError(error) {
            withReactContent(Swal).fire({
              title: 'Galat!',
              text: "Gagal menghapus media yang kamu pilih.",
              icon: 'error',
            })
          }
        });
      }
    });
  }

  return (
    <>
      <ImageGalleryWrapper>
        {mappingToPreviewUrl.map((item, index) => (
          <ImageGalleryWrap key={item.id} onClick={() => openLightboxOnSlide(index + 1)}>
            <RemoveButton type='button' onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
              <FontAwesomeIcon icon={faTrash} />
            </RemoveButton>
            <Image src={item.url} alt={item.name} />
          </ImageGalleryWrap>
        ))}
      </ImageGalleryWrapper>

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={mappingToRealImageUrl.map((item) => item.url)}
        slide={lightboxController.slide}
      />
    </>
  );
}

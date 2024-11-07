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

/**
 * Komponen styled untuk membungkus grid galeri gambar
 *
 * @component
 * @description Komponen wrapper yang menampilkan grid gambar dalam layout responsif.
 * Menggunakan CSS Grid untuk menata gambar dalam 4 kolom pada desktop dan 2 kolom pada mobile.
 *
 * @styled-component
 * @extends {HTMLDivElement}
 *
 * @css {display} grid - Menggunakan CSS Grid untuk layout
 * @css {grid-template-columns} repeat(4, 1fr) - 4 kolom dengan lebar yang sama pada desktop
 * @css {gap} 1rem - Jarak antar item grid
 * @css {margin-top} .325rem - Margin atas untuk spacing
 *
 * @media (width <= 992px) {
 *   @css {grid-template-columns} repeat(2, 1fr) - 2 kolom dengan lebar yang sama pada mobile
 * }
 *
 * @example
 * <ImageGalleryWrapper>
 *   <ImageGalleryWrap>
 *     <Image src="/path/to/image.jpg" alt="Gallery image" />
 *   </ImageGalleryWrap>
 *   // ... more gallery items
 * </ImageGalleryWrapper>
 */
const ImageGalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: .325rem;

  @media (width <= 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

/**
 * Komponen styled untuk membungkus gambar dalam galeri
 *
 * @component
 * @description Komponen wrapper yang menampilkan gambar dalam bentuk kotak dengan rasio 1:1.
 * Memiliki border dan border radius untuk tampilan yang rapi. Cursor pointer menandakan elemen dapat diklik.
 *
 * @styled-component
 * @extends {HTMLDivElement}
 *
 * @css {position} relative - Untuk penempatan elemen child secara absolut
 * @css {aspect-ratio} 1/1 - Memastikan bentuk kotak sempurna
 * @css {display} flex - Menggunakan flexbox untuk penataan konten
 * @css {align-items} center - Posisi vertikal di tengah
 * @css {justify-content} center - Posisi horizontal di tengah
 * @css {overflow} hidden - Menyembunyikan konten yang keluar dari container
 * @css {border-radius} var(--bs-border-radius) - Border radius dari variabel Bootstrap
 * @css {border} 1px solid rgba(var(--bs-body-color-rgb), .125) - Border tipis dengan opacity rendah
 * @css {cursor} pointer - Menunjukkan elemen dapat diklik
 *
 * @example
 * <ImageGalleryWrap>
 *   <Image src="/path/to/image.jpg" alt="Gallery image" />
 * </ImageGalleryWrap>
 */
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

/**
 * Komponen styled image untuk menampilkan gambar dalam galeri
 *
 * @component
 * @description Komponen gambar yang mengisi seluruh area parent dengan rasio aspek yang dipertahankan.
 * Memiliki efek zoom saat hover untuk memberikan interaktivitas visual.
 *
 * @styled-component
 * @extends {HTMLImageElement}
 *
 * @css {width} 100% - Mengisi penuh lebar parent
 * @css {height} 100% - Mengisi penuh tinggi parent
 * @css {object-fit} cover - Mempertahankan rasio aspek dan memotong jika perlu
 * @css {object-position} center - Posisi gambar di tengah area
 * @css {transition} all .2s - Animasi halus untuk semua perubahan properti
 * @css {transform} scale(1.25) - Perbesar 125% saat hover
 *
 * @example
 * <Image src="/path/to/image.jpg" alt="Gallery image" />
 */
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

/**
 * Komponen styled button untuk menghapus gambar dari galeri
 *
 * @component
 * @description Tombol berbentuk persegi yang diposisikan di pojok kanan atas dari setiap gambar
 * dalam galeri. Memiliki latar belakang merah (danger) dan ikon tempat sampah berwarna putih.
 *
 * @styled-component
 * @extends {HTMLButtonElement}
 *
 * @css {position} absolute - Memposisikan tombol secara absolut relatif terhadap parent
 * @css {top} 0 - Menempel di bagian atas
 * @css {right} 0 - Menempel di bagian kanan
 * @css {background-color} var(--bs-danger) - Menggunakan warna danger dari Bootstrap
 * @css {color} white - Warna teks/ikon putih
 * @css {border} none - Tanpa border
 * @css {border-radius} 0 0 0 var(--bs-border-radius-xl) - Border radius hanya di pojok kiri bawah
 * @css {width} 40px - Lebar tetap 40px
 * @css {height} 40px - Tinggi tetap 40px
 * @css {display} flex - Menggunakan flexbox untuk penataan
 * @css {font-size} .925rem - Ukuran font/ikon
 * @css {align-items} center - Penataan vertikal di tengah
 * @css {justify-content} center - Penataan horizontal di tengah
 * @css {padding} 0 - Tanpa padding
 * @css {z-index} 10 - Layer di atas gambar
 * @css {cursor} pointer - Cursor pointer saat hover
 *
 * @example
 * <RemoveButton onClick={handleDelete}>
 *   <FontAwesomeIcon icon={faTrash} />
 * </RemoveButton>
 */
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

/**
 * Komponen ImageGallery untuk menampilkan galeri gambar dengan fitur lightbox dan penghapusan
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {MediaLibrary[]} props.initialData - Data awal media library yang akan ditampilkan
 *
 * @typedef {Object} MediaLibrary
 * @property {number} id - ID unik media
 * @property {string} name - Nama file media
 * @property {string} original_url - URL asli media
 *
 * @returns {JSX.Element} Komponen ImageGallery dengan grid gambar dan lightbox
 */
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

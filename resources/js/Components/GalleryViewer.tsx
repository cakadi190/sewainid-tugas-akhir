import { MediaLibrary } from "@/types/medialibrary";
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

/**
 * Komponen styled untuk membungkus galeri gambar
 * Menyediakan layout yang fleksibel berdasarkan prop isWrap
 *
 * Props:
 * @prop {boolean} isWrap - Menentukan apakah galeri ditampilkan dalam grid (true) atau baris horizontal (false)
 *
 * Styling:
 * - Menggunakan flex layout untuk tampilan horizontal
 * - Menggunakan grid layout 4 kolom untuk tampilan wrap
 * - Memiliki gap 1rem antar item
 * - Memiliki border radius sesuai variabel bootstrap
 * - Mendukung overflow horizontal untuk scrolling
 */
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

/**
 * Komponen styled yang membungkus PerfectScrollbar untuk menampilkan galeri gambar secara horizontal
 * dengan scrolling yang halus
 *
 * Styling:
 * - Menggunakan flexbox dengan arah horizontal (row)
 * - Mengambil lebar penuh (100%) dari parent container
 * - Memberikan jarak 1rem antar item galeri menggunakan gap
 *
 * Props yang diwariskan dari PerfectScrollbar:
 * - options: Konfigurasi scrollbar seperti suppressScrollY
 * - className: Class tambahan untuk styling
 * - children: Konten/item galeri yang akan ditampilkan
 *
 * Digunakan sebagai wrapper dalam GalleryViewer untuk menampung item-item galeri
 * dan memberikan pengalaman scrolling yang lebih baik dibanding overflow default
 */
const PerfectScrollbarWrapper = styled(PerfectScrollbar)`
  display: flex;
  flex-direction: row;
  width: 100%;
  GAP: 1rem;
`;

/**
 * Komponen styled untuk membungkus item galeri individual
 *
 * Komponen ini mengatur tampilan dan layout untuk setiap item galeri, dengan dukungan
 * untuk mode wrap dan non-wrap.
 *
 * Props:
 * @prop {boolean} isWrap - Menentukan mode tampilan:
 *   - false: Mode horizontal dengan aspect ratio 16:9 dan tinggi tetap 250px
 *   - true: Mode grid dengan ukuran tetap 150x150px
 *
 * Styling:
 * - Menggunakan flexbox untuk penataan konten di tengah
 * - Memiliki border tipis dengan opacity rendah
 * - Border radius mengikuti variabel bootstrap
 * - Overflow hidden untuk memastikan konten tidak keluar container
 * - Transisi halus saat hover
 *
 * Behavior:
 * - Dalam mode horizontal (!isWrap):
 *   - Mempertahankan aspect ratio 16:9
 *   - Tinggi tetap 250px
 *   - flex-shrink: 0 untuk mencegah penyusutan
 * - Dalam mode grid (isWrap):
 *   - Ukuran tetap 150x150px
 *   - Cocok untuk tampilan thumbnail grid
 *
 * Digunakan sebagai container untuk GalleryImage di dalam GalleryViewer
 */
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

/**
 * Komponen styled untuk gambar dalam galeri
 *
 * Komponen ini menangani tampilan gambar individual dalam galeri dengan
 * fitur responsif dan efek hover.
 *
 * Styling:
 * - Mengisi penuh container parent (width & height 100%)
 * - object-fit: cover untuk memastikan gambar mengisi ruang tanpa distorsi
 * - object-position: center untuk memposisikan gambar di tengah
 * - Transisi halus 0.2 detik untuk semua properti
 *
 * Behavior:
 * - Saat hover:
 *   - Gambar akan diperbesar 1.125x ukuran normal dengan animasi halus
 *   - Memberikan efek zoom in yang smooth
 *
 * Digunakan sebagai elemen img di dalam GalleryInner untuk menampilkan
 * gambar dari media library dengan tampilan yang konsisten
 */
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

/**
 * Komponen GalleryViewer untuk menampilkan galeri gambar dengan scrolling horizontal
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {MediaLibrary[]} props.data - Array berisi data media library yang akan ditampilkan
 * @param {boolean} props.wrap - Flag untuk mengatur mode tampilan (wrap/nowrap)
 *
 * @description
 * Komponen ini menampilkan galeri gambar dengan fitur:
 * - Scrolling horizontal menggunakan PerfectScrollbar
 * - 2 mode tampilan yang dapat diatur melalui prop wrap:
 *   - false: Tampilan landscape dengan aspect ratio 16:9
 *   - true: Tampilan grid dengan ukuran 150x150px
 * - Gambar responsive dengan object-fit cover
 * - Efek hover zoom pada gambar
 * - Border dan border radius pada container
 *
 * @example
 * ```jsx
 * <GalleryViewer
 *   data={mediaLibraryData}
 *   wrap={false}
 * />
 * ```
 *
 * @returns {JSX.Element} Komponen GalleryViewer yang telah dirender
 */
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

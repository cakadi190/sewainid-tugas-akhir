import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { generateAlphanumeric } from '@/Helpers/string';

/**
 * Komponen styled untuk area drop zone file upload
 *
 * @component
 * @extends {div}
 * @description
 * Komponen ini digunakan sebagai area drop zone untuk upload file dengan fitur drag & drop.
 * Memiliki tampilan visual yang responsif terhadap aksi drag dengan perubahan warna border dan background.
 *
 * Props:
 * @prop {boolean} isDragActive - Status apakah sedang terjadi drag file di atas komponen
 *
 * Styling:
 * - Border dashed 2px dengan warna biru (#007bff) saat drag aktif atau abu-abu (#ced4da) saat idle
 * - Border radius 8px untuk sudut yang melengkung
 * - Padding 20px untuk spacing internal
 * - Text align center untuk konten tercentering
 * - Background color semi transparan biru saat drag aktif
 * - Transisi smooth 0.3s untuk animasi perubahan visual
 * - Cursor pointer untuk indikasi area yang dapat diklik
 *
 * @example
 * <DropZone isDragActive={isDragging}>
 *   <p>Drag & drop file di sini atau klik untuk memilih</p>
 * </DropZone>
 */
const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#007bff' : '#ced4da'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: ${props => props.isDragActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
`;

/**
 * Komponen styled untuk menampilkan container preview gambar
 *
 * @component
 * @extends {div}
 * @description
 * Komponen ini digunakan sebagai container untuk menampilkan preview gambar-gambar yang telah diunggah.
 * Menggunakan flexbox layout untuk menata preview gambar secara responsif.
 *
 * Fitur:
 * - Display flex untuk layout yang fleksibel
 * - Flex-wrap wrap agar item dapat turun ke baris baru saat container penuh
 * - Gap 10px untuk memberikan jarak antar preview gambar
 * - Margin top 10px untuk memberikan jarak dengan elemen di atasnya
 *
 * Styling:
 * - Display flex untuk layout flexbox
 * - Flex-wrap wrap untuk wrapping item
 * - Gap 10px untuk spacing antar item
 * - Margin-top 10px untuk spacing vertikal
 *
 * @example
 * <ImagePreviewContainer>
 *   <PreviewWrapper>
 *     <PreviewImage src="..." />
 *   </PreviewWrapper>
 * </ImagePreviewContainer>
 */
const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

/**
 * Komponen styled untuk membungkus preview gambar
 *
 * @component
 * @extends {div}
 * @description
 * Komponen ini digunakan sebagai wrapper/pembungkus untuk preview gambar dalam dropzone.
 * Memiliki ukuran tetap 150x150 pixel dan menggunakan flexbox untuk penataan konten.
 *
 * Properti styling:
 * - Position relative untuk penempatan tombol hapus absolute
 * - Ukuran tetap 150x150 pixel
 * - Flexbox dengan konten tercentering
 * - Overflow hidden untuk membatasi gambar yang lebih besar
 * - Border radius menggunakan variabel Bootstrap xl
 * - Border tipis dengan opacity menggunakan warna body dari Bootstrap
 *
 * @example
 * <PreviewWrapper>
 *   <PreviewImage src={imageUrl} alt="Preview" />
 *   <RemoveButton onClick={handleRemove} />
 * </PreviewWrapper>
 */
const PreviewWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--bs-border-radius-xl);
  border: 1px solid rgba(var(--bs-body-color-rgb), .125);
`;

/**
 * Komponen styled untuk menampilkan preview gambar yang diunggah
 *
 * @component
 * @extends {img}
 * @description
 * Komponen ini digunakan untuk menampilkan preview gambar yang diunggah dalam dropzone.
 * Gambar akan ditampilkan dengan ukuran penuh dan dipotong sesuai container (object-fit: cover).
 *
 * Fitur:
 * - Mengisi penuh container parent (width & height 100%)
 * - Object-fit cover untuk memastikan gambar mengisi container dengan baik
 * - Object-position center untuk memposisikan gambar di tengah
 * - Efek transisi halus 0.2 detik untuk semua perubahan
 * - Efek hover yang akan memperbesar gambar (scale 1.25)
 *
 * Styling:
 * - Width & height 100% untuk mengisi container
 * - Object-fit cover & object-position center untuk penempatan gambar
 * - Transisi 0.2s untuk animasi halus
 * - Transform scale pada hover untuk efek zoom
 */
const PreviewImage = styled.img`
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
 * Komponen styled untuk tombol hapus pada preview gambar
 *
 * @component
 * @extends {button}
 * @description
 * Tombol berbentuk persegi yang diposisikan di pojok kanan atas preview gambar.
 * Menggunakan warna danger dari Bootstrap dan memiliki efek hover.
 *
 * Properti styling:
 * - Posisi absolute di pojok kanan atas (0,0)
 * - Background merah (danger) dari variabel Bootstrap
 * - Teks putih
 * - Tanpa border
 * - Border radius kiri bawah sesuai variabel Bootstrap
 * - Ukuran tetap 40x40 pixel
 * - Flexbox untuk centering konten
 * - Font size sedikit lebih kecil (.925rem)
 * - Z-index 10 untuk memastikan selalu di atas gambar
 * - Cursor pointer untuk UX yang lebih baik
 *
 * @example
 * <RemoveButton onClick={handleRemove}>
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
 * Interface untuk props komponen ImageUploader
 *
 * @interface ImageUploaderProps
 * @property {string} name - Nama field yang akan digunakan untuk form data
 * @property {object} form - Object form dari Inertia yang berisi method dan data
 * @property {function} form.setData - Method untuk mengatur nilai data form dengan parameter key dan value
 * @property {Record<string,any>} form.data - Object yang berisi seluruh data form saat ini
 * @property {Record<string,string>} [form.errors] - Object opsional yang berisi pesan error validasi
 * @property {string} [id] - ID opsional untuk elemen input file, jika tidak diisi akan digenerate otomatis
 * @property {number} [maxFileSize] - Ukuran maksimal yang diizinkan untuk setiap file dalam MB (default: 5)
 * @property {number} [maxTotalFileSize] - Total ukuran maksimal yang diizinkan untuk seluruh file dalam MB (default: 20)
 * @property {number} [maxFiles] - Jumlah maksimal file yang dapat diunggah (default: 5)
 * @property {string[]} [acceptedFileTypes] - Array berisi tipe MIME yang diizinkan (default: ['image/jpeg','image/png','image/gif'])
 */
interface ImageUploaderProps {
  name: string;
  form: {
    setData: (key: string, value: File[] | null) => void;
    data: Record<string, any>;
    errors?: Record<string, string>;
  };
  id?: string;
  maxFileSize?: number;
  maxTotalFileSize?: number;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

/**
 * Komponen ImageUploader untuk mengunggah dan mengelola beberapa berkas gambar
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {string} props.name - Nama field untuk form data
 * @param {Object} props.form - Object form dari Inertia
 * @param {Function} props.form.setData - Fungsi untuk mengatur data form
 * @param {Object} props.form.data - Data form saat ini
 * @param {Object} [props.form.errors] - Error validasi form
 * @param {string} [props.id] - ID custom untuk input file
 * @param {number} [props.maxFileSize=5] - Ukuran maksimal per file dalam MB
 * @param {number} [props.maxTotalFileSize=20] - Total ukuran maksimal semua file dalam MB
 * @param {number} [props.maxFiles=5] - Jumlah maksimal file yang dapat diunggah
 * @param {string[]} [props.acceptedFileTypes=['image/jpeg','image/png','image/gif']] - Tipe file yang diizinkan
 *
 * @returns {JSX.Element} Komponen ImageUploader dengan preview dan validasi
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  form,
  maxFileSize = 5,
  maxTotalFileSize = 20,
  maxFiles = 5,
  id,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif']
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formInputId = () => id ?? 'uploader-' + generateAlphanumeric(32);

  const validateFiles = (newFiles: File[]): boolean => {
    const newErrors: string[] = [];
    let totalSize = files.reduce((acc, file) => acc + file.size, 0);

    newFiles.forEach(file => {
      if (!acceptedFileTypes.includes(file.type)) {
        newErrors.push(`Tipe berkas ${file.name} tidak diizinkan`);
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        newErrors.push(`${file.name} melebihi batas ukuran ${maxFileSize}MB`);
      }

      totalSize += file.size;
    });

    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(`Maksimal ${maxFiles} berkas yang dapat diunggah`);
    }

    if (totalSize > maxTotalFileSize * 1024 * 1024) {
      newErrors.push(`Total ukuran berkas melebihi ${maxTotalFileSize}MB`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const processFiles = (newFiles: File[]) => {
    if (validateFiles(newFiles)) {
      const newFilesArray = [...files, ...newFiles];
      setFiles(newFilesArray);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);

      form.setData(name, newFilesArray.length > 0 ? newFilesArray : []);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    processFiles(newFiles);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const newFiles = Array.from(event.dataTransfer.files);
    processFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);

    form.setData(name, newFiles.length > 0 ? newFiles : []);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        id={formInputId()}
        accept={acceptedFileTypes.join(',')}
        style={{ display: 'none' }}
      />
      <DropZone
        isDragActive={isDragActive}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <FontAwesomeIcon icon={faUpload} size="2xl" color="#6c757d" />
        <p className="mt-2">
          Seret & lepas berkas di sini atau klik untuk memilih
        </p>
        <p className="text-muted small">
          Maksimal {maxFiles} berkas, masing-masing {maxFileSize}MB
          (Total {maxTotalFileSize}MB)
        </p>
      </DropZone>

      {(errors.length > 0 || form.errors?.[name]) && (
        <div className="mt-2 text-danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
          {form.errors?.[name] && <div>{form.errors[name]}</div>}
        </div>
      )}

      {previews.length > 0 && (
        <ImagePreviewContainer>
          {previews.map((preview, index) => (
            <PreviewWrapper key={index}>
              <RemoveButton type='button' onClick={() => removeFile(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </RemoveButton>
              <PreviewImage
                src={preview}
                alt={`Preview ${index + 1}`}
              />
            </PreviewWrapper>
          ))}
        </ImagePreviewContainer>
      )}
    </div>
  );
};

export default ImageUploader;

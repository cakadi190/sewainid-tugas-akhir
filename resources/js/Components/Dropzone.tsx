import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { generateAlphanumeric } from '@/Helpers/string';

const DropZone = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#007bff' : '#ced4da'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background-color: ${props => props.isDragActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

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
      // Validasi tipe berkas
      if (!acceptedFileTypes.includes(file.type)) {
        newErrors.push(`Tipe berkas ${file.name} tidak diizinkan`);
      }

      // Validasi ukuran berkas individu
      if (file.size > maxFileSize * 1024 * 1024) {
        newErrors.push(`${file.name} melebihi batas ukuran ${maxFileSize}MB`);
      }

      totalSize += file.size;
    });

    // Validasi jumlah total berkas
    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(`Maksimal ${maxFiles} berkas yang dapat diunggah`);
    }

    // Validasi total ukuran berkas
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

      // Generate preview
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);

      // Update Inertia form data for gallery
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

    // Update Inertia form data
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

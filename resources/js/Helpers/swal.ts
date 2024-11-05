// src/helpers/AlertHelper.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Inisialisasi dengan React Content
const MySwal = withReactContent(Swal);

// Tipe untuk berbagai opsi alert
type AlertOptions = {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

// Fungsi untuk alert sukses
export const showSuccessAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'success',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-success', // Menggunakan Bootstrap 5 class untuk tombol
    },
  });
};

// Fungsi untuk alert info
export const showInfoAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'info',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-info', // Menggunakan Bootstrap 5 class untuk tombol
    },
  });
};

// Fungsi untuk alert peringatan
export const showWarningAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'warning',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-warning',
    },
  });
};

// Fungsi untuk alert kesalahan
export const showErrorAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'error',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-danger',
    },
  });
};

// Fungsi untuk alert konfirmasi
export const showConfirmAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'question',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Yes',
    cancelButtonText: options.cancelButtonText || 'No',
    buttonsStyling: false,
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-primary me-2',
      cancelButton: 'btn btn-secondary',
    },
  });
};

// Fungsi untuk alert yang dinamis
export const renderSwalModal = (type: 'success' | 'info' | 'error' | 'warning', options: AlertOptions) => {
  const alertRender = {
    success: () => showSuccessAlert(options),
    error: () => showErrorAlert(options),
    warning: () => showWarningAlert(options),
    info: () => showInfoAlert(options),
  }[type];

  return alertRender();
};

/**
 * Modul untuk menampilkan berbagai jenis alert menggunakan SweetAlert2
 *
 * @module AlertHelper
 * @requires sweetalert2
 * @requires sweetalert2-react-content
 */

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Interface untuk opsi konfigurasi alert
 *
 * @interface AlertOptions
 * @property {string} title - Judul alert yang akan ditampilkan
 * @property {string} [text] - Teks deskripsi alert (opsional)
 * @property {string} [confirmButtonText] - Teks untuk tombol konfirmasi (default: 'OK')
 * @property {string} [cancelButtonText] - Teks untuk tombol batal (default: 'No')
 */
type AlertOptions = {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

/**
 * Menampilkan alert sukses dengan ikon dan styling yang sesuai
 *
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
export const showSuccessAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'success',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-success',
    },
  });
};

/**
 * Menampilkan alert informasi dengan ikon dan styling yang sesuai
 *
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
export const showInfoAlert = (options: AlertOptions) => {
  return MySwal.fire({
    icon: 'info',
    title: options.title,
    text: options.text,
    confirmButtonText: options.confirmButtonText || 'OK',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-info',
    },
  });
};

/**
 * Menampilkan alert peringatan dengan ikon dan styling yang sesuai
 *
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
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

/**
 * Menampilkan alert kesalahan dengan ikon dan styling yang sesuai
 *
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
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

/**
 * Menampilkan alert konfirmasi dengan dua tombol pilihan
 *
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
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

/**
 * Fungsi utilitas untuk menampilkan alert berdasarkan tipe yang diberikan
 *
 * @param {'success' | 'info' | 'error' | 'warning'} type - Tipe alert yang akan ditampilkan
 * @param {AlertOptions} options - Opsi konfigurasi alert
 * @returns {Promise} Promise dari SweetAlert2
 */
export const renderSwalModal = (type: 'success' | 'info' | 'error' | 'warning', options: AlertOptions): Promise<any> => {
  const alertRender = {
    success: () => showSuccessAlert(options),
    error: () => showErrorAlert(options),
    warning: () => showWarningAlert(options),
    info: () => showInfoAlert(options),
  }[type];

  return alertRender();
};

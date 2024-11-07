/**
 * Komponen AlertPage untuk menampilkan pesan alert menggunakan SweetAlert2
 *
 * @component
 * @description
 * Komponen ini menangani tampilan alert/notifikasi menggunakan SweetAlert2.
 * Alert akan muncul secara otomatis ketika ada perubahan pada prop alert.
 * Mendukung 4 tipe alert: error, success, warning, dan info.
 *
 * @param {Object} props - Props komponen
 * @param {string} [props.className] - Class CSS tambahan untuk container
 *
 * @example
 * // Penggunaan dasar
 * <AlertPage />
 *
 * // Dengan class tambahan
 * <AlertPage className="mt-4" />
 *
 * @typedef {Object} AlertTypes
 * @property {string} title - Judul alert yang akan ditampilkan
 * @property {'success'|'info'|'error'|'warning'} type - Tipe alert
 * @property {string} [message] - Pesan alert yang akan ditampilkan
 */

import { renderSwalModal } from '@/Helpers/swal';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

const AlertPage: React.FC<{ className?: string }> = ({ className }) => {
  const { props: { alert } } = usePage<PageProps>();

  type AlertTypes = {
    title: string;
    type: 'success' | 'info' | 'error' | 'warning';
    message?: string;
  }

  useEffect(() => {
    const alertTypes: AlertTypes[] = [
      { title: 'Galat!', type: 'error', message: alert?.danger || alert?.error },
      { title: 'Berhasil!', type: 'success', message: alert?.success },
      { title: 'Peringatan!', type: 'warning', message: alert?.warning },
      { title: 'Informasi.', type: 'info', message: alert?.info },
    ];

    alertTypes.forEach(({ type, message, title }) => {
      if (message) {
        renderSwalModal(type, {
          title: title,
          text: message,
        });
      }
    });
  }, [alert]);

  return <div className={className}></div>;
};

export default AlertPage;

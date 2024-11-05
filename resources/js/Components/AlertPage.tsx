import { renderSwalModal } from '@/Helpers/swal';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

  return <div className={className}></div>; // Empty div since alerts are shown via SweetAlert
};

export default AlertPage;

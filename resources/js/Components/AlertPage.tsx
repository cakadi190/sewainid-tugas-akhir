import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const AlertPage: React.FC<{ className?: string }> = ({ className }) => {
  const { props: { alert } } = usePage<PageProps>();

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const alertTypes = [
      { type: 'error', message: alert?.danger || alert?.error },
      { type: 'success', message: alert?.success },
      { type: 'warning', message: alert?.warning },
      { type: 'info', message: alert?.info },
    ];

    alertTypes.forEach(({ type, message }) => {
      if (message) {
        MySwal.fire({
          icon: type as SweetAlertIcon,
          title: type.charAt(0).toUpperCase() + type.slice(1), // Capitalizes the first letter of the type
          text: message,
          showConfirmButton: true,
        });
      }
    });
  }, [alert, MySwal]);

  return <div className={className}></div>; // Empty div since alerts are shown via SweetAlert
};

export default AlertPage;

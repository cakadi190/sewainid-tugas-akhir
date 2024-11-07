import { useCallback } from 'react';
import { useSidebarStore } from '@/Store/sidebarStore';

/**
 * Hook untuk mengelola state dan aksi sidebar
 *
 * @returns {Object} Object yang berisi state dan fungsi untuk mengontrol sidebar
 * @property {boolean} isOpen - Status apakah sidebar sedang terbuka
 * @property {() => void} toggle - Fungsi untuk toggle sidebar antara buka/tutup
 * @property {() => void} open - Fungsi untuk membuka sidebar
 * @property {() => void} close - Fungsi untuk menutup sidebar
 */
export const useSidebar = () => {
  const { isOpen, toggle, open, close } = useSidebarStore();

  const handleToggle = useCallback(() => {
    toggle();
  }, [toggle]);

  const handleOpen = useCallback(() => {
    open();
  }, [open]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  return {
    isOpen,
    toggle: handleToggle,
    open: handleOpen,
    close: handleClose,
  };
};

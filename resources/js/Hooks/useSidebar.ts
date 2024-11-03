import { useCallback } from 'react';
import { useSidebarStore } from '@/Store/sidebarStore';

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

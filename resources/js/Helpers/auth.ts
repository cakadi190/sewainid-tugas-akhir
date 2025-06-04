import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

/**
 * Hook kustom untuk mengelola autentikasi dan peran pengguna dalam aplikasi
 *
 * @module useAuth
 * @returns {Object} Objek yang berisi fungsi-fungsi untuk pengecekan autentikasi
 * @property {Function} isGuest - Fungsi untuk mengecek apakah pengguna adalah tamu
 * @property {Function} isLoggedIn - Fungsi untuk mengecek apakah pengguna sudah login
 * @property {Function} isRole - Fungsi untuk mengecek peran spesifik pengguna
 *
 * @example
 * const { isGuest, isLoggedIn, isRole } = useAuth();
 *
 * // Cek apakah pengguna adalah tamu
 * if (isGuest()) {
 *   // Lakukan sesuatu untuk tamu
 * }
 *
 * // Cek apakah pengguna sudah login
 * if (isLoggedIn()) {
 *   // Lakukan sesuatu untuk pengguna yang login
 * }
 *
 * // Cek peran pengguna
 * if (isRole('admin')) {
 *   // Lakukan sesuatu untuk admin
 * }
 */
export const useAuth = () => {
  const {
    props: {
      auth: { user },
    },
  } = usePage<PageProps>();

  const isGuest = (): boolean => {
    return !user || Object.keys(user).length === 0 || !user.id;
  };

  const isLoggedIn = (): boolean => {
    return !!user && !!user.id;
  };

  const isRole = (role: 'admin' | 'operator' | 'user'): boolean => {
    return !!user && !!user.role && user.role === role;
  };

  return {
    isGuest,
    isLoggedIn,
    isRole,
  };
};

import { usePage } from '@inertiajs/react';

import { PageProps } from '@/types';

/**
 * Custom hook to check authentication and user roles.
 */
export const useAuth = () => {
  const {
    props: {
      auth: { user },
    },
  } = usePage<PageProps>();

  /**
   * Check if the user is a guest (no valid user).
   * @returns {boolean} - Returns true if the user is a guest
   */
  const isGuest = (): boolean => {
    return !user || Object.keys(user).length === 0 || !user.id;
  };

  /**
   * Check if the user is logged in (valid user).
   * @returns {boolean} - Returns true if the user is logged in
   */
  const isLoggedIn = (): boolean => {
    return !!user && !!user.id;
  };

  /**
   * Check if the user has a specific role.
   * @param {string} role - The role to check for ('admin', 'operator', 'user')
   * @returns {boolean} - Returns true if the user has the specified role
   */
  const isRole = (role: 'admin' | 'operator' | 'user'): boolean => {
    return !!user && !!user.role && user.role.key === role;
  };

  return {
    isGuest,
    isLoggedIn,
    isRole,
  };
};

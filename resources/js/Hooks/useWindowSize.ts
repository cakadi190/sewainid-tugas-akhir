import { useState, useEffect } from 'react';

/**
 * Hook kustom untuk melacak ukuran jendela browser secara real-time
 *
 * @returns {Object} Objek yang berisi properti width dan height dari ukuran jendela saat ini
 * @property {number} width - Lebar jendela browser dalam piksel
 * @property {number} height - Tinggi jendela browser dalam piksel
 *
 * @example
 * const { width, height } = useWindowSize();
 * console.log(`Window size: ${width} x ${height}`);
 *
 * @description
 * Hook ini akan memperbarui nilai ukuran jendela secara otomatis saat pengguna
 * mengubah ukuran browser. Hook ini juga menangani pembersihan event listener
 * saat komponen tidak lagi digunakan untuk mencegah memory leak.
 *
 * Nilai awal akan di-set ke 0 jika window belum tersedia (SSR/server-side rendering)
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Fungsi untuk menghasilkan judul halaman dengan menambahkan nama aplikasi
 *
 * @param {string} title - Judul halaman yang akan digabungkan dengan nama aplikasi
 * @returns {string} Mengembalikan string berupa gabungan judul dan nama aplikasi yang dipisahkan dengan bullet (•)
 *
 * @description
 * Fungsi ini mengambil nama aplikasi dari environment variable VITE_APP_NAME.
 * Jika environment variable tidak ditemukan, maka akan menggunakan default value 'Laravel'.
 * Jika parameter title kosong, maka hanya akan mengembalikan nama aplikasi saja.
 * Jika parameter title ada isinya, maka akan mengembalikan format: [title] • [nama_aplikasi]
 *
 * @example
 * generateTitle('Dashboard') // returns "Dashboard • MyApp"
 * generateTitle('') // returns "MyApp"
 */
export const generateTitle = (title: string): string =>
  title ? `${title} • ${appName}` : appName;

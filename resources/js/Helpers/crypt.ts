import MD5 from 'crypto-js/md5';

/**
 * Fungsi untuk menghasilkan MD5 hash dari sebuah string input
 * MD5 (Message Digest Algorithm 5) adalah fungsi hash kriptografik yang menghasilkan nilai hash 128-bit
 * Biasa digunakan untuk verifikasi integritas data atau hashing password (meskipun tidak direkomendasikan untuk keamanan)
 *
 * @param {string} input - String yang akan dikonversi menjadi MD5 hash
 * @returns {string} Hasil MD5 hash dalam format string heksadesimal (32 karakter)
 * @example
 * generateMD5('test') // returns '098f6bcd4621d373cade4e832627b4f6'
 */
const generateMD5 = (input: string): string => {
  return MD5(input).toString();
};

/**
 * Fungsi untuk menghasilkan string acak dengan panjang yang dapat disesuaikan
 * Menggunakan kombinasi huruf besar, huruf kecil, dan angka (total 62 karakter)
 * Berguna untuk membuat token, password sementara, atau identifier unik
 *
 * @param {number} length - Panjang string yang diinginkan (default: 32)
 * @returns {string} String acak dengan panjang sesuai parameter
 * @throws {Error} Jika length bernilai negatif atau 0
 * @example
 * generateRandomString() // returns string acak 32 karakter
 * generateRandomString(16) // returns string acak 16 karakter
 */
const generateRandomString = (length: number = 32): string =>
  Array.from(
    { length },
    () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
        (Math.random() * 62) | 0
      ],
  ).join('');

/**
 * Fungsi untuk menghasilkan angka acak dalam rentang tertentu (inklusif)
 * Menggunakan Math.random() yang menghasilkan angka pseudo-random
 * Hasil mencakup batas bawah dan batas atas (inklusif)
 *
 * @param {number} min - Nilai minimum yang mungkin dihasilkan
 * @param {number} max - Nilai maksimum yang mungkin dihasilkan
 * @returns {number} Angka acak antara min dan max (inklusif)
 * @throws {Error} Jika min lebih besar dari max
 * @example
 * generateRandomNumber(1, 10) // returns angka antara 1 sampai 10
 * generateRandomNumber(0, 100) // returns angka antara 0 sampai 100
 */
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const utils = {
  generateMD5,
  generateRandomString,
  generateRandomNumber,
};

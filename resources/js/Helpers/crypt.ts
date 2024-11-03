import MD5 from 'crypto-js/md5';

/**
 * Menghasilkan MD5 hash dari input string.
 *
 * @param {string} input - String yang akan di-hash.
 * @returns {string} - MD5 hash dalam format heksadesimal.
 */
const generateMD5 = (input: string): string => {
  return MD5(input).toString();
};

/**
 * Menghasilkan string acak dengan panjang tertentu.
 *
 * @param {number} length - Panjang string acak yang ingin dihasilkan.
 * @returns {string} - String acak yang dihasilkan.
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
 * Menghasilkan nomor acak dalam rentang tertentu.
 *
 * @param {number} min - Batas bawah rentang.
 * @param {number} max - Batas atas rentang.
 * @returns {number} - Nomor acak yang dihasilkan dalam rentang [min, max].
 */
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const utils = {
  generateMD5,
  generateRandomString,
  generateRandomNumber,
};

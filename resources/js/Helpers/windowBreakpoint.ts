/**
 * Fungsi untuk memeriksa apakah lebar jendela lebih besar dari nilai yang ditentukan
 *
 * @param {number} width - Lebar yang akan dibandingkan
 * @param {number} currentWidth - Lebar jendela saat ini
 * @returns {boolean} - Mengembalikan true jika lebar jendela lebih besar dari lebar yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isWider = windowIsWidthGreaterThan(768, window.innerWidth);
 * if (isWider) {
 *   // Lakukan sesuatu untuk layar yang lebih lebar
 * }
 */
export const windowIsWidthGreaterThan = (width: number, currentWidth: number): boolean => {
  return currentWidth > width;
};

/**
 * Fungsi untuk memeriksa apakah lebar jendela lebih kecil dari nilai yang ditentukan
 *
 * @param {number} width - Lebar yang akan dibandingkan
 * @param {number} currentWidth - Lebar jendela saat ini
 * @returns {boolean} - Mengembalikan true jika lebar jendela lebih kecil dari lebar yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isNarrower = windowIsWidthLessThan(768, window.innerWidth);
 * if (isNarrower) {
 *   // Lakukan sesuatu untuk layar yang lebih sempit
 * }
 */
export const windowIsWidthLessThan = (width: number, currentWidth: number): boolean => {
  return currentWidth < width;
};

/**
 * Fungsi untuk memeriksa apakah lebar jendela sama dengan nilai yang ditentukan
 *
 * @param {number} width - Lebar yang akan dibandingkan
 * @param {number} currentWidth - Lebar jendela saat ini
 * @returns {boolean} - Mengembalikan true jika lebar jendela sama dengan lebar yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isEqual = windowIsWidthEqualTo(1024, window.innerWidth);
 * if (isEqual) {
 *   // Lakukan sesuatu untuk layar dengan lebar yang sama persis
 * }
 */
export const windowIsWidthEqualTo = (width: number, currentWidth: number): boolean => {
  return currentWidth === width;
};

/**
 * Fungsi untuk memeriksa apakah lebar jendela berada di antara dua nilai yang ditentukan (inklusif)
 *
 * @param {number} minWidth - Lebar minimum
 * @param {number} maxWidth - Lebar maksimum
 * @param {number} currentWidth - Lebar jendela saat ini
 * @returns {boolean} - Mengembalikan true jika lebar jendela berada di antara minWidth dan maxWidth (inklusif)
 * @example
 * // Contoh penggunaan:
 * const isBetween = windowIsWidthBetween(768, 1024, window.innerWidth);
 * if (isBetween) {
 *   // Lakukan sesuatu untuk layar dengan lebar menengah
 * }
 */
export const windowIsWidthBetween = (minWidth: number, maxWidth: number, currentWidth: number): boolean => {
  return currentWidth >= minWidth && currentWidth <= maxWidth;
};

/**
 * Fungsi untuk memeriksa apakah tinggi jendela lebih besar dari nilai yang ditentukan
 *
 * @param {number} height - Tinggi yang akan dibandingkan
 * @param {number} currentHeight - Tinggi jendela saat ini
 * @returns {boolean} - Mengembalikan true jika tinggi jendela lebih besar dari tinggi yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isTaller = windowIsHeightGreaterThan(600, window.innerHeight);
 * if (isTaller) {
 *   // Lakukan sesuatu untuk layar yang lebih tinggi
 * }
 */
export const windowIsHeightGreaterThan = (height: number, currentHeight: number): boolean => {
  return currentHeight > height;
};

/**
 * Fungsi untuk memeriksa apakah tinggi jendela lebih kecil dari nilai yang ditentukan
 *
 * @param {number} height - Tinggi yang akan dibandingkan
 * @param {number} currentHeight - Tinggi jendela saat ini
 * @returns {boolean} - Mengembalikan true jika tinggi jendela lebih kecil dari tinggi yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isShorter = windowIsHeightLessThan(600, window.innerHeight);
 * if (isShorter) {
 *   // Lakukan sesuatu untuk layar yang lebih pendek
 * }
 */
export const windowIsHeightLessThan = (height: number, currentHeight: number): boolean => {
  return currentHeight < height;
};

/**
 * Fungsi untuk memeriksa apakah tinggi jendela sama dengan nilai yang ditentukan
 *
 * @param {number} height - Tinggi yang akan dibandingkan
 * @param {number} currentHeight - Tinggi jendela saat ini
 * @returns {boolean} - Mengembalikan true jika tinggi jendela sama dengan tinggi yang ditentukan
 * @example
 * // Contoh penggunaan:
 * const isEqual = windowIsHeightEqualTo(800, window.innerHeight);
 * if (isEqual) {
 *   // Lakukan sesuatu untuk layar dengan tinggi yang sama persis
 * }
 */
export const windowIsHeightEqualTo = (height: number, currentHeight: number): boolean => {
  return currentHeight === height;
};

/**
 * Fungsi untuk memeriksa apakah tinggi jendela berada di antara dua nilai yang ditentukan (inklusif)
 *
 * @param {number} minHeight - Tinggi minimum
 * @param {number} maxHeight - Tinggi maksimum
 * @param {number} currentHeight - Tinggi jendela saat ini
 * @returns {boolean} - Mengembalikan true jika tinggi jendela berada di antara minHeight dan maxHeight (inklusif)
 * @example
 * // Contoh penggunaan:
 * const isBetween = windowIsHeightBetween(600, 900, window.innerHeight);
 * if (isBetween) {
 *   // Lakukan sesuatu untuk layar dengan tinggi menengah
 * }
 */
export const windowIsHeightBetween = (minHeight: number, maxHeight: number, currentHeight: number): boolean => {
  return currentHeight >= minHeight && currentHeight <= maxHeight;
};

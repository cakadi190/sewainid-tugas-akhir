/**
 * Mengoptimalkan ekstraksi path dari string URL yang diberikan.
 *
 * @param {string} urlString - URL lengkap yang akan diekstrak path-nya
 * @returns {string | null} Path dari URL (contoh: "/dashboard"), atau null jika URL tidak valid
 */
export const extractPath = (urlString: string): string | null => {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Mengoptimalkan perbandingan path target dengan path URL saat ini.
 *
 * @param {string} urlTarget - Path target yang akan dibandingkan (contoh: "/dashboard")
 * @param {string} current - URL lengkap saat ini yang akan dibandingkan
 * @returns {boolean} True jika path yang diekstrak dari URL saat ini cocok dengan path target, false jika tidak
 */
export const isSameUrl = (urlTarget: string, current: string): boolean => {
  if (extractPath(urlTarget) === null) return current === '/';
  return extractPath(urlTarget) === current;
};

/**
 * Mengoptimalkan penggabungan URL dasar aplikasi dengan path yang diberikan.
 *
 * @param {string} [path] - Path opsional yang akan digabungkan dengan URL dasar
 * @returns {string} URL lengkap hasil penggabungan URL dasar dengan path
 * @throws {TypeError} Jika VITE_APP_URL tidak valid atau tidak didefinisikan
 */
export const baseUrl = (path?: string): string =>
  new URL(path ?? '', import.meta.env.VITE_APP_URL).toString();

/**
 * Interface untuk opsi konfigurasi pembuatan string
 */
interface GeneratorOptions {
  includeUpperCase?: boolean;
  includeLowerCase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
  customChars?: string;
}

/**
 * Mengoptimalkan pembuatan string acak berdasarkan opsi yang ditentukan.
 *
 * @param {number} length - Panjang string yang akan dihasilkan
 * @param {GeneratorOptions} options - Opsi konfigurasi untuk pembuatan string
 * @returns {string} String acak yang dihasilkan
 * @throws {Error} Jika panjang kurang dari 1 atau tidak ada set karakter yang dipilih
 */
const generateString = (length: number, options: GeneratorOptions = {}): string => {
  if (length < 1) throw new Error('Length must be at least 1');

  const charSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const chars = [
    options.includeUpperCase !== false && charSets.upper,
    options.includeLowerCase !== false && charSets.lower,
    options.includeNumbers && charSets.numbers,
    options.includeSpecialChars && charSets.special,
    options.customChars
  ].filter(Boolean).join('');

  if (!chars) throw new Error('At least one character set must be selected');

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

/**
 * Mengoptimalkan pembuatan angka acak dalam rentang yang ditentukan.
 *
 * @param {number} min - Nilai minimum (inklusif)
 * @param {number} max - Nilai maksimum (inklusif)
 * @param {boolean} [isFloat=false] - Apakah akan menghasilkan angka desimal
 * @param {number} [decimals=2] - Jumlah angka desimal untuk angka float
 * @returns {number} Angka acak yang dihasilkan
 * @throws {Error} Jika min lebih besar dari max atau decimals kurang dari 0
 */
const generateNumber = (
  min: number,
  max: number,
  isFloat: boolean = false,
  decimals: number = 2
): number => {
  if (min > max) {
    throw new Error('Minimum value must be less than or equal to maximum value');
  }

  if (decimals < 0) {
    throw new Error('Decimals must be greater than or equal to 0');
  }

  const random = Math.random() * (max - min) + min;
  return isFloat ? Number(random.toFixed(decimals)) : Math.floor(random);
};

/**
 * Mengoptimalkan pembuatan string alfanumerik acak.
 *
 * @param {number} length - Panjang string alfanumerik
 * @param {boolean} [lettersOnly=false] - Apakah hanya menyertakan huruf (tanpa angka)
 * @returns {string} String alfanumerik acak yang dihasilkan
 * @throws {Error} Jika panjang kurang dari 1
 */
const generateAlphanumeric = (length: number, lettersOnly: boolean = false): string => {
  return generateString(length, {
    includeUpperCase: true,
    includeLowerCase: true,
    includeNumbers: !lettersOnly
  });
};

/**
 * Fungsi untuk menolak tag yang berpotensi xss
 *
 * @param {string} input - String yang akan diuji
 * @returns {string} String yang telah diuji
 */
const parseAntiXss = (input: string): string => {
  const cleanInput = input.replace(/<script>|<\/script>/gi, '');
  return cleanInput;
};

export {
  generateString,
  generateNumber,
  generateAlphanumeric,
  type GeneratorOptions,
  parseAntiXss
};

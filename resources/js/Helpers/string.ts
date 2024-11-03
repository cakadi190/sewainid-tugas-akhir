/**
 * Extracts the path from a given URL string.
 *
 * @param {string} urlString - The full URL from which to extract the path.
 * @returns {string | null} The path from the URL (e.g., "/dashboard"), or null if the URL is invalid.
 */
export const extractPath = (urlString: string): string | null => {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error);
    return null;
    /* eslint-enable no-console */
  }
};

/**
 * Checks if the target path matches the path of the current URL.
 *
 * @param {string} urlTarget - The target path to compare (e.g., "/dashboard").
 * @param {string} current - The current full URL to compare against.
 * @returns {boolean} True if the extracted path from the current URL matches the target path, otherwise false.
 */
export const isSameUrl = (urlTarget: string, current: string): boolean => {
  if (extractPath(urlTarget) === null) return current === '/';
  return extractPath(urlTarget) === current;
};

/**
 * Menggabungkan URL dasar aplikasi dengan path yang diberikan.
 *
 * @param {string} [path] - Path opsional yang akan digabungkan dengan URL dasar.
 *   Jika tidak diberikan atau undefined, hanya URL dasar yang akan dikembalikan.
 *
 * @returns {string} URL lengkap yang dihasilkan dari penggabungan URL dasar dengan path.
 *
 * @example
 * // Jika VITE_APP_URL adalah 'https://example.com'
 * baseUrl('/api/users'); // Returns: 'https://example.com/api/users'
 * baseUrl(); // Returns: 'https://example.com'
 *
 * @throws {TypeError} Jika VITE_APP_URL tidak valid atau tidak didefinisikan.
 */
export const baseUrl = (path?: string): string =>
  new URL(path ?? '', import.meta.env.VITE_APP_URL).toString();

/**
 * Collection of utility functions to generate random strings, numbers, and alphanumeric values
 * @module StringGenerator
 */

/**
 * Configuration options for string generation
 * @interface GeneratorOptions
 * @property {boolean} [includeUpperCase=true] - Include uppercase letters in generation
 * @property {boolean} [includeLowerCase=true] - Include lowercase letters in generation
 * @property {boolean} [includeNumbers=false] - Include numbers in generation
 * @property {boolean} [includeSpecialChars=false] - Include special characters in generation
 * @property {string} [customChars=''] - Custom characters to include in generation
 */
interface GeneratorOptions {
  includeUpperCase?: boolean;
  includeLowerCase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
  customChars?: string;
}

/**
 * Generates a random string based on specified options
 * @param {number} length - Length of the string to generate
 * @param {GeneratorOptions} options - Configuration options for string generation
 * @returns {string} Generated random string
 * @throws {Error} If length is less than 1 or no character set is selected
 * @example
 * // Generate a 10-character string with uppercase and lowercase letters
 * generateString(10, { includeUpperCase: true, includeLowerCase: true })
 * // Returns something like: "aXbYcZdWeF"
 */
const generateString = (length: number, options: GeneratorOptions = {}): string => {
  const {
    includeUpperCase = true,
    includeLowerCase = true,
    includeNumbers = false,
    includeSpecialChars = false,
    customChars = ''
  } = options;

  if (length < 1) {
    throw new Error('Length must be at least 1');
  }

  let chars = '';
  if (includeUpperCase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowerCase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) chars += '0123456789';
  if (includeSpecialChars) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (customChars) chars += customChars;

  if (!chars) {
    throw new Error('At least one character set must be selected');
  }

  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

/**
 * Generates a random number within specified range
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @param {boolean} [isFloat=false] - Whether to generate floating point number
 * @param {number} [decimals=2] - Number of decimal places for float numbers
 * @returns {number} Generated random number
 * @throws {Error} If min is greater than max or decimals is less than 0
 * @example
 * // Generate integer between 1 and 100
 * generateNumber(1, 100)
 * // Returns something like: 42
 *
 * // Generate float with 2 decimal places
 * generateNumber(1, 100, true, 2)
 * // Returns something like: 42.69
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
 * Generates a random alphanumeric string
 * @param {number} length - Length of the alphanumeric string
 * @param {boolean} [lettersOnly=false] - Whether to include only letters (no numbers)
 * @returns {string} Generated random alphanumeric string
 * @throws {Error} If length is less than 1
 * @example
 * // Generate 8-character alphanumeric string
 * generateAlphanumeric(8)
 * // Returns something like: "a1B2c3D4"
 *
 * // Generate 8-character letters-only string
 * generateAlphanumeric(8, true)
 * // Returns something like: "aBcDeFgH"
 */
const generateAlphanumeric = (length: number, lettersOnly: boolean = false): string => {
  return generateString(length, {
    includeUpperCase: true,
    includeLowerCase: true,
    includeNumbers: !lettersOnly
  });
};

export {
  generateString,
  generateNumber,
  generateAlphanumeric,
  type GeneratorOptions
};

/**
 * Memeriksa apakah array yang diberikan tidak kosong.
 *
 * @template T
 * @param {T[]} arr - Array yang akan diperiksa.
 * @returns {boolean} - Mengembalikan true jika array valid dan memiliki setidaknya satu elemen;
 *                      jika tidak, false.
 */
export const isNotEmptyArray = <T>(arr: T[]): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Mengonversi nilai null atau undefined menjadi array kosong.
 *
 * @template T
 * @param {T[] | null | undefined} arr - Nilai yang akan diperiksa dan dikonversi.
 * @returns {T[]} - Mengembalikan array asli jika valid; jika tidak, mengembalikan array kosong.
 */
export const convertNullIntoArray = <T>(arr: T[] | null | undefined): T[] => {
  return Array.isArray(arr) ? arr : [];
};

/**
 * Menentukan apakah suatu nilai dianggap benar (truthy).
 *
 * Nilai dianggap benar jika bernilai '1', 'true', true, atau 1.
 *
 * @param value - Nilai yang akan diperiksa.
 * @returns True jika nilai dianggap benar, false jika tidak.
 */
export const isTruthy = <T>(value: T): boolean => {
  return (
    value === ('1' as T) ||
    value === ('true' as T) ||
    value === (true as T) ||
    value === (1 as T)
  );
};

/**
 * Menentukan apakah suatu nilai dianggap salah (falsy).
 *
 * Nilai dianggap salah jika bernilai '0', 'false', false, atau 0.
 *
 * @param value - Nilai yang akan diperiksa.
 * @returns True jika nilai dianggap salah, false jika tidak.
 */
export const isFalsy = <T>(value: T): boolean => {
  return (
    value === ('0' as T) ||
    value === ('false' as T) ||
    value === (false as T) ||
    value === (0 as T)
  );
};

/**
 * Check if the value is undefined.
 * @param value - The value to check.
 * @returns true if the value is undefined, false otherwise.
 */
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

/**
 * Check if the value is null.
 * @param value - The value to check.
 * @returns true if the value is null, false otherwise.
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Mengembalikan nilai jika kondisi benar, jika tidak mengembalikan null.
 *
 * @template T
 * @param {boolean} condition - Kondisi yang akan dievaluasi.
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi benar.
 * @returns {T | null} - Mengembalikan nilai jika kondisi benar; jika tidak, null.
 */
export const returnConditionIfTrue = <T>(
  condition: boolean,
  returnedValue: T,
): T | null => {
  return condition ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi salah, jika tidak mengembalikan null.
 *
 * @template T
 * @param {boolean} condition - Kondisi yang akan dievaluasi.
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi salah.
 * @returns {T | null} - Mengembalikan nilai jika kondisi salah; jika tidak, null.
 */
export const returnConditionIfFalse = <T>(
  condition: boolean,
  returnedValue: T,
): T | null => {
  return !condition ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi benar, mengembalikan null jika undefined.
 *
 * @template T - Tipe nilai yang dikembalikan.
 * @param {boolean | null | undefined} condition - Kondisi yang diperiksa.
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi benar.
 * @returns {T | null} - Nilai yang dikembalikan jika kondisi benar, null jika undefined.
 */
export const returnTrueConditionIfUndefined = <T>(
  condition: boolean | null | undefined,
  returnedValue: T,
): T | null => {
  return condition === undefined || condition === null ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi salah, mengembalikan null jika undefined.
 *
 * @template T - Tipe nilai yang dikembalikan.
 * @param {boolean | null | undefined} condition - Kondisi yang diperiksa.
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi salah.
 * @returns {T | null} - Nilai yang dikembalikan jika kondisi salah, null jika undefined.
 */
export const returnFalseConditionIfUndefined = <T>(
  condition: boolean | null | undefined,
  returnedValue: T,
): T | null => {
  return !(condition === undefined || condition === null)
    ? returnedValue
    : null;
};

/**
 * Memeriksa apakah string `str` mengandung substring `value`.
 *
 * @param {string} str - String yang akan diperiksa.
 * @param {string} value - Substring yang akan dicari dalam `str`.
 * @returns {boolean} - Mengembalikan true jika substring ditemukan dalam `str`,
 *                      jika tidak mengembalikan false.
 */
export const includeSome = (str: string, value: string): boolean => {
  return str.includes(value);
};

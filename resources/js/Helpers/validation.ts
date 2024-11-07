/**
 * Memeriksa apakah array yang diberikan tidak kosong.
 *
 * @template T - Tipe data elemen array
 * @param {T[]} arr - Array yang akan diperiksa
 * @returns {boolean} Mengembalikan true jika array valid dan memiliki minimal 1 elemen, false jika tidak
 * @example
 * isNotEmptyArray([1, 2, 3]) // true
 * isNotEmptyArray([]) // false
 * isNotEmptyArray(null) // false
 */
export const isNotEmptyArray = <T>(arr: T[]): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Mengonversi nilai null/undefined menjadi array kosong.
 *
 * @template T - Tipe data elemen array
 * @param {T[] | null | undefined} arr - Nilai yang akan dikonversi
 * @returns {T[]} Array asli jika valid, array kosong jika null/undefined
 * @example
 * convertNullIntoArray([1, 2]) // [1, 2]
 * convertNullIntoArray(null) // []
 * convertNullIntoArray(undefined) // []
 */
export const convertNullIntoArray = <T>(arr: T[] | null | undefined): T[] => {
  return Array.isArray(arr) ? arr : [];
};

/**
 * Memeriksa apakah suatu nilai dianggap truthy.
 *
 * @template T - Tipe data nilai yang diperiksa
 * @param {T} value - Nilai yang akan diperiksa
 * @returns {boolean} True jika nilai adalah '1', 'true', true, atau 1
 * @example
 * isTruthy('1') // true
 * isTruthy(true) // true
 * isTruthy('false') // false
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
 * Memeriksa apakah suatu nilai dianggap falsy.
 *
 * @template T - Tipe data nilai yang diperiksa
 * @param {T} value - Nilai yang akan diperiksa
 * @returns {boolean} True jika nilai adalah '0', 'false', false, atau 0
 * @example
 * isFalsy('0') // true
 * isFalsy(false) // true
 * isFalsy('true') // false
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
 * Memeriksa apakah suatu nilai undefined.
 *
 * @param {unknown} value - Nilai yang akan diperiksa
 * @returns {boolean} True jika undefined, false jika tidak
 * @example
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 * isUndefined('') // false
 */
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

/**
 * Memeriksa apakah suatu nilai null.
 *
 * @param {unknown} value - Nilai yang akan diperiksa
 * @returns {boolean} True jika null, false jika tidak
 * @example
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull('') // false
 */
export const isNull = (value: unknown): value is null => value === null;

/**
 * Mengembalikan nilai jika kondisi true, null jika false.
 *
 * @template T - Tipe data nilai yang dikembalikan
 * @param {boolean} condition - Kondisi yang dievaluasi
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi true
 * @returns {T | null} Nilai jika kondisi true, null jika false
 * @example
 * returnConditionIfTrue(true, 'value') // 'value'
 * returnConditionIfTrue(false, 'value') // null
 */
export const returnConditionIfTrue = <T>(
  condition: boolean,
  returnedValue: T,
): T | null => {
  return condition ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi false, null jika true.
 *
 * @template T - Tipe data nilai yang dikembalikan
 * @param {boolean} condition - Kondisi yang dievaluasi
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi false
 * @returns {T | null} Nilai jika kondisi false, null jika true
 * @example
 * returnConditionIfFalse(false, 'value') // 'value'
 * returnConditionIfFalse(true, 'value') // null
 */
export const returnConditionIfFalse = <T>(
  condition: boolean,
  returnedValue: T,
): T | null => {
  return !condition ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi undefined/null.
 *
 * @template T - Tipe data nilai yang dikembalikan
 * @param {boolean | null | undefined} condition - Kondisi yang diperiksa
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi undefined/null
 * @returns {T | null} Nilai jika kondisi undefined/null, null jika tidak
 * @example
 * returnTrueConditionIfUndefined(undefined, 'value') // 'value'
 * returnTrueConditionIfUndefined(null, 'value') // 'value'
 * returnTrueConditionIfUndefined(true, 'value') // null
 */
export const returnTrueConditionIfUndefined = <T>(
  condition: boolean | null | undefined,
  returnedValue: T,
): T | null => {
  return condition === undefined || condition === null ? returnedValue : null;
};

/**
 * Mengembalikan nilai jika kondisi bukan undefined/null.
 *
 * @template T - Tipe data nilai yang dikembalikan
 * @param {boolean | null | undefined} condition - Kondisi yang diperiksa
 * @param {T} returnedValue - Nilai yang dikembalikan jika kondisi bukan undefined/null
 * @returns {T | null} Nilai jika kondisi bukan undefined/null, null jika undefined/null
 * @example
 * returnFalseConditionIfUndefined(true, 'value') // 'value'
 * returnFalseConditionIfUndefined(undefined, 'value') // null
 * returnFalseConditionIfUndefined(null, 'value') // null
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
 * Memeriksa apakah string mengandung substring tertentu.
 *
 * @param {string} str - String yang diperiksa
 * @param {string} value - Substring yang dicari
 * @returns {boolean} True jika substring ditemukan, false jika tidak
 * @example
 * includeSome('hello world', 'world') // true
 * includeSome('hello', 'x') // false
 */
export const includeSome = (str: string, value: string): boolean => {
  return str.includes(value);
};

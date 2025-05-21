/**
 * Konfigurasi dayjs untuk aplikasi
 *
 * @description
 * File ini mengkonfigurasi dayjs dengan:
 * - Mengimpor library dayjs utama
 * - Mengimpor locale Indonesia untuk format tanggal dalam bahasa Indonesia
 * - Mengimpor plugin localizedFormat untuk memformat tanggal sesuai locale
 * - Mengaktifkan plugin localizedFormat
 * - Mengatur locale default ke Indonesia
 *
 * @module dayjs
 * @requires dayjs
 * @requires dayjs/locale/id
 * @requires dayjs/plugin/localizedFormat
 *
 * @exports {Object} dayjs - Instance dayjs yang telah dikonfigurasi
 */
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale('id');
dayjs.extend(utc);

export default dayjs;

/**
 * Formats a given date into a 'YYYY-MM-DD' string.
 *
 * @param {Date | any} date - The date to format. Can be a Date object or any object with a format method.
 * @returns {string} A string representing the formatted date in 'YYYY-MM-DD' format.
 */
export const formatDateForInput = (date: Date | any): string => {
  if (date && typeof date.format === 'function') {
    return date.format('YYYY-MM-DD');
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a given date string into a string with the WIB (Western Indonesia Time)
 * timezone, using the 'LLLL' format.
 *
 * @param {string} dateString - The date string to format. Must be in a format that
 *   dayjs can parse.
 * @returns {string} A string representing the formatted date in WIB timezone.
 */
export const formatDateToWIB = (dateString: string): string => {
  return dayjs(dateString).utcOffset(7 * 60).format('LLLL');
};

/**
 * Checks if the given date string is more than the current date and time.
 *
 * @param {string} dateString - The date string to check. Must be in a format that
 *   dayjs can parse.
 * @returns {boolean} True if the given date string is more than the current date
 *   and time; false otherwise.
 */
export const isMoreThanNow = (dateString: string): boolean => {
  const target = dayjs(dateString).utcOffset(7 * 60);
  const now = dayjs().utcOffset(7 * 60);
  return now.isAfter(target);
};


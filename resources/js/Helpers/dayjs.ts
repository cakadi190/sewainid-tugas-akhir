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

dayjs.extend(localizedFormat);
dayjs.locale('id');

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

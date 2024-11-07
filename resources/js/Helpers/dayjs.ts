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

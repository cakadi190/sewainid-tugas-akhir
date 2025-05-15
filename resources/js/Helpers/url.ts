/**
 * Fungsi untuk membangun query string dari objek parameter yang diberikan
 *
 * @param {Record<string, string | boolean>} params - Objek yang berisi parameter query
 *                                                   - Key: nama parameter (string)
 *                                                   - Value: nilai parameter (string atau boolean)
 * @example
 * // Contoh penggunaan:
 * const params = {
 *   search: 'test',
 *   active: true,
 *   empty: ''
 * };
 * buildQueryString(params); // Returns: "?search=test&active=true"
 *
 * @returns {string} Query string yang sudah diformat
 *                  - Jika ada parameter valid, mengembalikan string dengan awalan "?"
 *                  - Jika tidak ada parameter valid, mengembalikan string kosong
 * @note
 * - Parameter dengan nilai false atau string kosong akan difilter
 * - Key dan value akan di-encode menggunakan encodeURIComponent
 */
export const buildQueryString = (
  params: Record<string, string | boolean>,
): string => {
  const queryParams = Object.entries(params)
    .filter(([, value]) => value !== false && value !== '')
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

/**
 * Mengambil parameter query dari URL yang diberikan
 *
 * @param {string} url - URL yang berisi parameter query
 * @returns {Record<string, string>} Objek yang berisi parameter query
 *                                  - Key: nama parameter (string)
 *                                  - Value: nilai parameter (string)
 * @example
 * // Contoh penggunaan:
 * const url = 'https://example.com/path?search=test&active=true';
 * extractQueryParams(url); // Returns: { search: 'test', active: 'true' }
 *
 * @note
 * - Jika URL tidak berisi parameter query, mengembalikan objek kosong
 * - Nilai parameter di-decode menggunakan decodeURIComponent
 */
export const extractQueryParams = (url: string): Record<string, string> => {
  const queryString = url.split('?')[1];
  if (!queryString) return {};

  return queryString.split('&').reduce((acc, param) => {
    const [key, value] = param.split('=');
    if (key) acc[key] = decodeURIComponent(value || '');
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Generates a URL for the image optimizer route with the given URL as a parameter.
 *
 * @param {string} url - The URL of the image to be optimized.
 * @returns {string} The complete URL for the image optimizer route.
 */
export const wrapOptimizeUrl = (url: string): string => {
  return route('v1.global.image-optimize', { url });
};

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

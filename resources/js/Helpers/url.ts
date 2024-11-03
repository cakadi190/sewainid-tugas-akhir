/**
 * Builds a query string from a given parameter object.
 *
 * @param {Record<string, string | boolean>} params - An object containing query parameters.
 * @returns {string} A formatted query string.
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

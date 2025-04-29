/**
 * Formats a given number into Indonesian Rupiah currency format.
 *
 * @param {number} amount - The numeric value to be formatted.
 * @returns {string} - The formatted currency string in IDR.
 */
export const currencyFormat = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
};

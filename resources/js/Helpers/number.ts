/**
 * Formats a given number into Indonesian Rupiah currency format.
 *
 * @param {number} amount - The numeric value to be formatted.
 * @returns {string} - The formatted currency string in IDR.
 */
export const currencyFormat = (amount: number): string => {
  if(isNaN(amount)) return '-';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a given number into Indonesian format.
 *
 * @param {number|string} value - The numeric value to be formatted.
 * @param {number} [minimumFractionDigits=2] - The minimum number of fraction digits to display.
 * @param {number} [maximumFractionDigits=2] - The maximum number of fraction digits to display.
 * @returns {string} - The formatted number string.
 */
export const numberFormat = (
  value: number | string,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(value));
};

/**
 * Formats a given mileage value into a string with the specified unit.
 *
 * @param {number|string} value - The numeric value to be formatted.
 * @param {'km'|'mil'} [unit='km'] - The unit to use for the formatted output.
 * @returns {string} - The formatted mileage string with the specified unit.
 */
export const mileageFormat = (
  value: number | string,
  unit: 'km' | 'mil' = 'km'
): string => {
  const numberValue = Number(value);

  if (isNaN(numberValue)) return '-';

  const convertedValue = unit === 'mil'
    ? numberValue * 0.621371
    : numberValue;

  const formattedValue = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedValue);

  const unitLabel = unit === 'mil' ? 'mi' : 'km';

  return `${formattedValue} ${unitLabel}`;
};

/**
 * Formats a given speed value into a string with the specified unit.
 *
 * @param {number|string} value - The numeric value to be formatted.
 * @param {'kmh'|'mph'} [unit='kmh'] - The unit to use for the formatted output.
 * @returns {string} - The formatted speed string with the specified unit.
 */
export const speedFormat = (
  value: number | string,
  unit: 'kmh' | 'mph' = 'kmh'
): string => {
  const numberValue = Number(value);

  if (isNaN(numberValue)) return '-';

  const convertedValue = unit === 'mph'
    ? numberValue * 0.621371
    : numberValue;

  const formattedValue = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedValue);

  const unitLabel = unit === 'mph' ? 'mph' : 'km/h';

  return `${formattedValue} ${unitLabel}`;
};

type FormatCompactOptions = {
  currency?: string;
  locale?: string;
  showCurrency?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

/**
 * Formats a given number into a compact currency string, with options for currency, locale,
 * whether to show the currency symbol, and the minimum and maximum number of fraction digits.
 *
 * The function takes a number or string as the first argument, and an object with the following
 * properties as the second argument:
 *
 * - `currency`: The ISO 4217 currency code to use for the formatted output. Defaults to `'IDR'`.
 * - `locale`: The locale to use for the formatted output. Defaults to `'id-ID'`.
 * - `showCurrency`: Whether to show the currency symbol in the formatted output. Defaults to `true`.
 * - `minimumFractionDigits`: The minimum number of fraction digits to show in the formatted output.
 *   Defaults to `0`.
 * - `maximumFractionDigits`: The maximum number of fraction digits to show in the formatted output.
 *   Defaults to `1`.
 *
 * The function returns a string with the formatted value.
 *
 * @example
 * compactCurrencyFormat(123456, { currency: 'USD', locale: 'en-US', showCurrency: true }) // '$123.46K'
 * compactCurrencyFormat(123456, { currency: 'USD', locale: 'en-US', showCurrency: false }) // '123.46K'
 * compactCurrencyFormat(123456, { currency: 'IDR', locale: 'id-ID', showCurrency: true }) // 'Rp123.456K'
 */
export function compactCurrencyFormat(
  value: number | string,
  {
    currency = 'IDR',
    locale = 'id-ID',
    showCurrency = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
  }: FormatCompactOptions = {}
): string {
  let num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '-';

  const isNegative = num < 0;
  const absValue = Math.abs(num);

  const units = ['', 'rb', 'jt', 'M', 'T', 'Q'];
  let unitIndex = 0;
  let displayValue = absValue;

  while (displayValue >= 1000 && unitIndex < units.length - 1) {
    displayValue /= 1000;
    unitIndex++;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(displayValue);

  const prefix = isNegative ? '-' : '';
  const suffix = showCurrency ? ` ${currency}` : '';

  return `${prefix}${formatted}${units[unitIndex]}${suffix}`;
}

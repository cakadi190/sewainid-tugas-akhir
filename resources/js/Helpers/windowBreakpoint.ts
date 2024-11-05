// utils.ts

/**
 * Function to check if window width is greater than a specified value
 * @param width - The width to compare with
 * @param currentWidth - The current window width
 * @returns boolean - True if window width is greater than the specified width
 */
export const windowIsWidthGreaterThan = (width: number, currentWidth: number): boolean => {
  return currentWidth > width;
};

/**
 * Function to check if window width is less than a specified value
 * @param width - The width to compare with
 * @param currentWidth - The current window width
 * @returns boolean - True if window width is less than the specified width
 */
export const windowIsWidthLessThan = (width: number, currentWidth: number): boolean => {
  return currentWidth < width;
};

/**
 * Function to check if window width is equal to a specified value
 * @param width - The width to compare with
 * @param currentWidth - The current window width
 * @returns boolean - True if window width is equal to the specified width
 */
export const windowIsWidthEqualTo = (width: number, currentWidth: number): boolean => {
  return currentWidth === width;
};

/**
 * Function to check if window width is between two specified values (inclusive)
 * @param minWidth - The minimum width
 * @param maxWidth - The maximum width
 * @param currentWidth - The current window width
 * @returns boolean - True if window width is between minWidth and maxWidth (inclusive)
 */
export const windowIsWidthBetween = (minWidth: number, maxWidth: number, currentWidth: number): boolean => {
  return currentWidth >= minWidth && currentWidth <= maxWidth;
};

/**
 * Function to check if window height is greater than a specified value
 * @param height - The height to compare with
 * @param currentHeight - The current window height
 * @returns boolean - True if window height is greater than the specified height
 */
export const windowIsHeightGreaterThan = (height: number, currentHeight: number): boolean => {
  return currentHeight > height;
};

/**
 * Function to check if window height is less than a specified value
 * @param height - The height to compare with
 * @param currentHeight - The current window height
 * @returns boolean - True if window height is less than the specified height
 */
export const windowIsHeightLessThan = (height: number, currentHeight: number): boolean => {
  return currentHeight < height;
};

/**
 * Function to check if window height is equal to a specified value
 * @param height - The height to compare with
 * @param currentHeight - The current window height
 * @returns boolean - True if window height is equal to the specified height
 */
export const windowIsHeightEqualTo = (height: number, currentHeight: number): boolean => {
  return currentHeight === height;
};

/**
 * Function to check if window height is between two specified values (inclusive)
 * @param minHeight - The minimum height
 * @param maxHeight - The maximum height
 * @param currentHeight - The current window height
 * @returns boolean - True if window height is between minHeight and maxHeight (inclusive)
 */
export const windowIsHeightBetween = (minHeight: number, maxHeight: number, currentHeight: number): boolean => {
  return currentHeight >= minHeight && currentHeight <= maxHeight;
};

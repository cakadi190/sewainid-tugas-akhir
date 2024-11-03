const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Generates a page title by appending the application name.
 *
 * This function takes a `title` string and appends the application name to it,
 * using the `VITE_APP_NAME` environment variable from `import.meta.env`.
 * If the environment variable is not set, it defaults to "Laravel".
 * If no `title` is provided, the function returns the application name alone.
 *
 * @param {string} title - The title of the page. Can be an empty string.
 * @returns {string} - The concatenated title and app name, or just the app name if the title is empty.
 *
 * Example:
 * ```ts
 * generateTitle('Home');  // returns 'Home - MyAppName'
 * generateTitle('');      // returns 'MyAppName'
 * ```
 */
export const generateTitle = (title: string): string =>
  title ? `${title} • ${appName}` : appName;

import { useState, useRef, useEffect } from "react";

/**
 * A custom hook that provides a function to copy a given string or number to the clipboard.
 *
 * @returns A tuple containing:
 *   - status: A boolean indicating whether the value has been successfully copied.
 *   - copy: A function to execute the copy action that accepts a value parameter.
 *   - error: Any error that occurred during the copy operation.
 */
const useCopy = (): [boolean, (value: string | number) => Promise<void>, Error | null] => {
  const [status, setStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = async (value: string | number): Promise<void> => {
    if (!navigator.clipboard) {
      const clipboardError = new Error('Clipboard API not supported');
      setError(clipboardError);
      return;
    }

    try {
      await navigator.clipboard.writeText(value.toString());
      setStatus(true);
      setError(null);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setStatus(false);
      }, 1500);
    } catch (err) {
      const copyError = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      setError(copyError);
      setStatus(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [status, copy, error];
};

export default useCopy;

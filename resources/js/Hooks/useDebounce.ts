import { useCallback, useRef, useEffect } from "react";

type AnyFunction = (...args: any[]) => any;

/**
 * Custom hook that returns a debounced version of the provided callback function.
 * The debounced function will postpone its execution until after the specified delay
 * period has elapsed since the last time it was invoked.
 *
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the callback function
 */
export function useDebounce<T extends AnyFunction>(callback: T, delay: number) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

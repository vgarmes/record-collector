import { useEffect } from 'react';

export function useDebounce(
  value: string,
  delay: number,
  callback: (debouncedValue: string) => void
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);
}

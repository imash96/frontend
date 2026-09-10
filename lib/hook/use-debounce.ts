"use client"; // Ensure this is a client component in Next.js

import { useEffect, useRef, useState } from "react";

const isClient = typeof window !== "undefined";

export default function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isClient) {
      setDebouncedValue(value);
      return;
    }

    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set new timer
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup on unmount or dependency change
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

import { useState, useEffect } from "react";

type TDebouncedCallback<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500
): TDebouncedCallback<T> {
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedCallback = ((...args: any[]) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            callback(...args);
        }, delay);

        setDebounceTimer(timer);
    }) as T;

    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return debouncedCallback;
}

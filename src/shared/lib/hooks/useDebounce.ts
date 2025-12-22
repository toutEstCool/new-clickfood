// ============================================
// ПРИМЕР: useDebounce хук из shared/lib
// Универсальная утилита для всего приложения
// ============================================

import { useEffect, useState } from 'react';

/**
 * Хук для отложенного обновления значения
 * 
 * @param value - Значение для дебаунса
 * @param delay - Задержка в миллисекундах
 * @returns Отложенное значение
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * // debouncedSearch обновится только через 500мс после последнего изменения
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

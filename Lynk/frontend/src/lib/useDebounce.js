import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 400) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handleTimeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)

        return () => clearTimeout(handleTimeout);
    }, [value, delay]);

    return debouncedValue;
}
import { useCallback, useEffect } from 'react';
export function useOutsideClickEvent(ref, callback) {
    const handleClickOutside = useCallback((event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            callback();
        }
    }, [ref, callback]);
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
}
export default useOutsideClickEvent;

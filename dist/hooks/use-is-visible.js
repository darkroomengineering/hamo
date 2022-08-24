import { useCallback, useEffect, useRef, useState } from 'react';
export const useIsVisible = ({ root = null, rootMargin = '0px', threshold = 1.0, } = {}) => {
    const ref = useRef();
    const [inView, setInView] = useState(false);
    const setRef = (node) => {
        if (!ref.current) {
            ref.current = node;
        }
    };
    const callbackFunction = useCallback((entries) => {
        const [entry] = entries;
        setInView(entry.isIntersecting);
    }, []);
    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction, {
            root,
            rootMargin,
            threshold,
        });
        if (ref.current)
            observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [callbackFunction]);
    return { setRef, inView };
};
export default useIsVisible;

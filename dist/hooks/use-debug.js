import { useMemo } from 'react';
export const useDebug = () => {
    const debug = useMemo(() => typeof window !== 'undefined'
        ? window.location.href.includes('#debug') ||
            process.env.NODE_ENV === 'development'
        : false, []);
    return debug;
};
export default useDebug;

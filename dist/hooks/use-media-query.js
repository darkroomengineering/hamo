import { useCallback, useState } from 'react';
import { useLayoutEffect } from './use-isomorphic-layout-effect';
export const useMediaQuery = (queryString) => {
    const [isMatch, setIsMatch] = useState(undefined);
    const mqChange = useCallback((mq) => {
        setIsMatch(mq.matches);
    }, []);
    useLayoutEffect(() => {
        const mq = window.matchMedia(queryString);
        mqChange(mq);
        mq.addEventListener('change', mqChange);
        return () => {
            mq.removeEventListener('change', mqChange);
        };
    });
    return isMatch;
};
export default useMediaQuery;

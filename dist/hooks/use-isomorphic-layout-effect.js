import { useEffect, useLayoutEffect as vanillaUseLayoutEffect } from 'react';
import { isBrowser } from '../misc/util';
export const useLayoutEffect = isBrowser ? vanillaUseLayoutEffect : useEffect;
export default useLayoutEffect;

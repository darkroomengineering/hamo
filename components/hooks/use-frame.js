import { raf } from "@react-spring/rafz";
import { useLayoutEffect, useId } from "react";

// https://github.com/pmndrs/react-spring/tree/master/packages/rafz#readme
const callbacks = {};

raf.onFrame(() => {
  Object.entries(callbacks)
    .sort((a, b) => a[1].priority - b[1].priority)
    .forEach(([, { callback }]) => {
      callback(raf.now());
    });
  return true;
});

export function useFrame(callback, priority = 0, deps = []) {
  const id = useId();

  useLayoutEffect(() => {
    if (callback) {
      callbacks[id] = { callback, priority };

      return () => {
        delete callbacks[id];
      };
    }
  }, [callback, id, priority, ...deps]);
}

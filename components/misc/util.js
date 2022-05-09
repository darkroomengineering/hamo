export const isBrowser = typeof window !== "undefined";

export const noop = () => {};

export const on = (obj, ...args) => {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...args);
  }
};

export const off = (obj, ...args) => {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...args);
  }
};

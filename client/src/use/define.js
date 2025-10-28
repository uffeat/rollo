export const define = (target, source, name) => {
  Object.defineProperty(target, name, {
    configurable: false,
    enumerable: true,
    writable: false,
    value: source,
  });
};

/* TODO
Specific unuse in component also
*/

export const on = (target, { run, ...options } = {}) => {
  return new Proxy(() => {}, {
    get(_, key) {
      const type = key;
      return new Proxy(() => {}, {
        get(_, key) {
          return (...args) => {
            const handler = Handler(run, args);
            if (key === "use") {
              target.addEventListener(type, handler, options);
              return handler;
            }
            if (key === "unuse") {
              target.removeEventListener(type, handler, options);
              return target;
            }
            throw new Error(`Invalid key: ${key}`);
          };
        },
        apply(_, thisArg, args) {
          const handler = Handler(run, args);
          target.addEventListener(type, handler, options);
          return handler;
        },
      });
    },
    set(_, type, handler) {
      if (run) {
        handler();
      }
      target.addEventListener(type, handler, options);
      return true;
    },
  });
};

function Handler(run, args) {
  const handler = args.find((a) => typeof a === "function");
  if (run) {
    handler();
  }
  return handler;
}

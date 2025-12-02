export const on = (target, { run, ...options } = {}) => {
  return new Proxy(() => {}, {
    get(_, type) {
      return new Proxy(() => {}, {
        get(_, key) {
          return (handler) => {
            if (key === "use") {
              return on(target, { run, ...options })[type](handler);
            }
            if (key === "unuse") {
              target.removeEventListener(type, handler, options);
              return target;
            }
            throw new Error(`Invalid key: ${key}`);
          };
        },
        apply(_, thisArg, args) {
          const handler = args[0];
          const result = {
            handler,
            remove: () => target.removeEventListener(type, handler),
            run,
            target,
            type,
            ...options,
          };

          if (run) {
            handler({ noevent: true, ...result });
          }

          target.addEventListener(type, handler, options);
          return result;
        },
      });
    },
    set(_, type, handler) {
      if (run) {
        handler({
          noevent: true,
          handler,
          run,
          target,
          type,
          ...options,
        });
      }
      target.addEventListener(type, handler, options);
      return true;
    },
  });
};

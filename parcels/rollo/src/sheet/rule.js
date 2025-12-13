import { type } from '../tools/type'

export const rule = (media) => {
  let selector = "";

  if (media) {
    // TODO
  }

  const instance = new (class {
    attrs(attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === true) {
          selector += `[${key}]`;
        } else {
          selector += `[${key}="${value}"]`;
        }
      }
    }

    child(child) {
      selector += ` > ${child}`;
    }

    classes(...classes) {
      for (const c of classes) {
        selector += `.${c}`;
      }
    }

    has(value) {
      selector += `:has(${descendant})`;
    }

    in(descendant) {
      selector += ` ${descendant}`;
    }

    is(value) {
      selector += `:is(${descendant})`;
    }

    not(value) {
      selector += `:not(${descendant})`;
    }
  })();

  const add = new Proxy(() => {}, {
    get(target, key) {
      if (key in instance) {
        const value = instance[key];
        if (typeof value === "function") {
          return (...args) => {
            value(...args);
            return add;
          };
        }
        // TODO
      }
      if (key === "_") {
        selector += " ";
        return add;
      }

      selector += key;
      return add;
    },
    apply(target, thisArg, args) {
      const arg = args[0];
      if (type(arg) === "Object") {
        return { [selector]: arg };
      }
      selector += arg;
      return add;
    },
  });

  return add;
};

import "../use.js";
import { reference } from "./reference.js";
const { camelToKebab } = await use("@/tools/case");

const root = document.documentElement;

const cls = new (class {
  #_ = {};

  constructor() {
    this.#_.color = new (class {
      get hex() {
        return new Proxy(
          {},
          {
            get(target, key) {
              return `#${key}`;
            },
          }
        );
      }
    })();
  }

  get __() {
    return new Proxy(
      {},
      {
        get(target, key) {
          const value = `var(--${camelToKebab(key, { numbers: true })})`;
          return value;
        },
      }
    );
  }

  get root() {
    return new Proxy(
      {},
      {
        get(target, key) {
          const value = getComputedStyle(root)
            .getPropertyValue(`--${camelToKebab(key, { numbers: true })}`)
            .trim();
          return value;
        },
      }
    );
  }

  get color() {
    return this.#_.color;
  }

  get value() {
    return new Proxy(
      {},
      {
        get(target, value) {
          return camelToKebab(value, { numbers: true });
        },
      }
    );
  }

  attr(value) {
    return `attr(${value})`;
  }

  important(...args) {
    return `${args.join(" ")} !important`;
  }

  rotate(value) {
    return `rotate(${value})`;
  }
})();

/* DSL-like helper for authoring CSS in JS. */
export const css = new Proxy(() => {}, {
  get(target, key) {
    if (key in cls) {
      return cls[key];
    }
    if (key in reference.style) {
      return new Proxy(
        {},
        {
          get(target, value) {
            return { [key]: camelToKebab(value, { numbers: true }) };
          },
        }
      );
    }

    return (value) => {
      if (key === "pct") {
        key = "%";
      }
      return `${value}${key}`;
    };
  },

  apply(target, thisArg, args) {
    args = args.map((a) => {
      if (a === "!") {
        return "!important";
      }
      return a;
    });
    return args.join(" ");
  },
});

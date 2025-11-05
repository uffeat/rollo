const { camelToKebab } = await use("@/tools/case.js");
const { WebComponent } = await use("@/component.js");

const reference = WebComponent();

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

  get color() {
    return this.#_.color;
  }

  get value() {
    return new Proxy(
      {},
      {
        get(target, value) {
          return camelToKebab(value, {numbers: true});
        },
      }
    );
  }

  attr(value) {
    return `attr(${value})`
  }
})();

/* DSL-like helper for authoring CSS in JS with reduced use of strings.
NOTE No effect beyond DX. */
export const css = new Proxy(() => {}, {
  get(_, key) {
    if (key in cls) {
      return cls[key];
    }
    if (key in reference.style) {
      return new Proxy(
        {},
        {
          get(target, value) {
            return { [key]: camelToKebab(value, {numbers: true}) };
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
      if (a === '!') {
        return '!important'
      }
      return a
    })
    return args.join(" ");
  },
});

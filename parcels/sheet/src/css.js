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
          return camelToKebab(value);
        },
      }
    );
  }
})();

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
            return { [key]: camelToKebab(value) };
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
    return args.join(" ");
  },
});

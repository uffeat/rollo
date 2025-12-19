import { Sheet } from "./sheet";
import { camelToKebab } from "../tools/case";
import { reference } from "./reference";

const root = document.documentElement;

/* Helper for 'css' proxy */
const dsl = new (class {
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

/* Helper for 'css' proxy */
const media = new (class {

  max(width) {
    return `@media (width <= ${width})`;

  }

  min(width) {
    return `@media (width >= ${width})`;

  }
})();

/* Tagged template function (helper for 'css' proxy) */
const joinTemplate = (strings, values) => {
  if (!values.length) return Sheet.create(strings[0]);
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }
  return Sheet.create(result);
};

/* Utility for authoring css/sheets in JS.
Uses:
- As tagged template that returns sheet constructed from text. Enables hijacking of
  VSCode plugin intended for lit (without using lit) to obtain linting etc.  
- As a means to author CSS text in a less "stringy" way; can in turn be used for:
  - Constructing sheets.
  - Hard styling.
NOTE Since this is optional DX only, I've chosen unify the features in
the 'css' utility. */
export const css = new Proxy(() => {}, {
  get(target, key) {
    if (key in dsl) {
      /* Returns dsl controller */
      return dsl[key];
    }

    if (key in reference.style) {
      /* Returns object that can be destructured to a full declaration.
      Example: `...css.display.flex` */
      return new Proxy(
        {},
        {
          get(target, value) {
            return { [key]: camelToKebab(value, { numbers: true }) };
          },
        }
      );
    }

    /* Returns media controller.
    Example: [css.media.min(css.px(600))]: { ... } */
    if (key === 'media') {
      return media
    }


    /* Returns declaration value string with unit value.
    Example: `width: css.rem(3)` */
    return (value) => {
      if (key === "pct") {
        key = "%";
      }
      return `${value}${key}`;
    };
  },

  apply(target, thisArg, args) {
    const first = args.at(0)
    if (Array.isArray(first)) {
      /* Used as tagged template: Returns constructed sheet from css text. */
      const [strings, ...values] = args;
      return joinTemplate(strings, values);
    }


    if (first instanceof HTMLElement && 'uid' in first) {
      /* Returns selector text that scopes to component uid.
      Example: `[css(myComponent)]: { ... }` */
      return `[uid="${first.uid}"]`;
    }

    /* Returns declaration value string consisting of multiple values.
    Example: `border: css(css.px(4), 'solid', 'green')` */
    args = args.map((a) => {
      if (a === "!") {
        return "!important";
      }
      return a;
    });
    return args.join(" ");
  },
});

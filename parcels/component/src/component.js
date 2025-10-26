import { factory } from "./tools/factory.js";
import { mix } from "./tools/mix.js";
import { mixins } from "./mixins/mixins.js";
import { registry } from "./tools/registry.js";

/* Registers native web component from tag and returns component class. */
const create = (tag) => {
  const key = `x-${tag}`;

  if (registry.has(key)) {
    return registry.get(key);
  }

  const ref = document.createElement(tag);
  const base = ref.constructor;
  if (base === HTMLUnknownElement) {
    throw new Error(`'${tag}' is not native.`);
  }

  const _mixins = Object.entries(mixins)
    .filter(([name, mixin]) => !["for_", "novalidation", "text"].includes(name))
    .map(([name, mixin]) => mixin);

  if ("textContent" in ref) {
    _mixins.push(mixins.text);
  }
  if (tag === "form") {
    _mixins.push(mixins.novalidation);
  }
  if (tag === "label") {
    _mixins.push(mixins.for_);
  }

  return registry.add(
    class extends mix(base, {}, ..._mixins) {
      static __key__ = key;
      static __native__ = tag;

      constructor() {
        super();
        this.setAttribute("web-component", "");
      }
    }
  );
};

/* Returns instance factory for basic non-autonomous web component. */
export const Factory = (tag) => {
  const cls = create(tag);
  //const instance = document.createElement(tag, { is: `x-${tag}` });
  const instance = new cls(); //
  return factory(instance);
};

/* Returns instance of basic non-autonomous web component. */
export const Component = (arg, ...args) => {
  const [tag, ...classes] = arg.split(".");
  const factory = Factory(tag);
  if (classes.length) {
    return factory(`${classes.join(".")}`, ...args);
  }
  return factory(...args);
};



/* Returns instance factory for basic non-autonomous web component. */
export const component = new Proxy(
  {},
  {
    get: (target, tag) => {
      return Factory(tag);
    },
  }
);

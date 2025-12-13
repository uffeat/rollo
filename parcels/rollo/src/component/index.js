import { stateMixin } from "../state/index";
import { factory } from "./tools/factory";
import { mix } from "./tools/mix";
import { Mixins, mixins } from "./mixins/mixins";
import { registry } from "./tools/registry";


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

  const _mixins = Mixins("!text", stateMixin);

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
    class Component extends mix(base, {}, ..._mixins) {
      static __key__ = key;
      static __native__ = tag;

      static create = (...args) => {
        const instance = new Component();
        return factory(instance)(...args);
      };

      __new__(...args) {
        super.__new__?.(...args);
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

/* Returns instance factory for basic non-autonomous web component. */
export const component = new Proxy(
  {},
  {
    get(_, tag) {
      return Factory(tag);
    },
  }
);

export { author } from "./tools/author";
export { factory, mix, Mixins, mixins, registry };

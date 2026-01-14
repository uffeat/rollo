import { stateMixin } from "../state";
import { is } from "../tools/is";
import { factory } from "./tools/factory";
import { mix } from "./tools/mix";
import { Mixins, mixins } from "./mixins/mixins";
import { registry } from "./tools/registry";

/* Registers native web component from tag and returns component class. */
const create = (...args) => {
  const tag = args.find((a) => is.string(a));

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
export const Component = (tag) => {
  const cls = create(tag);
  const instance = new cls();
  /* According to specs, I think it should be:
  const instance = document.createElement(tag, { is: `x-${tag}` });
  ... but the current implementation actually works better - tested across 
  all modern browsers. */
  return factory(instance);
};

/* Returns instance factory for basic non-autonomous web component. */
export const component = new Proxy(
  {},
  {
    get(...args) {

      console.log('args:', args)////


      const tag = args.find((a) => is.string(a));

      console.log('tag:', tag)////


      if (tag === "from") {
        return (html, { as, convert = true, ...updates } = {}) => {
          if (convert) {
            const nodes = htmlToComponent(html);
            if (nodes.length === 1) {
              if (as) {
                /* Optional wrap */
                return component[as](updates, nodes[0]);
              }
              /* No wrap */
              return nodes[0].update(updates);
            }
            /* Force wrap */
            return component[as || "div"](updates, ...nodes);
          }
          /* No conversion */
          return component[as || "div"]({ innerHTML: html, ...updates });
        };
      }
      return Component(tag);
    },
  }
);

/* Returns component with tree from html. */
function htmlToComponent(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const nodes = Array.from(wrapper.children, (c) => elementToComponent(c));
  return nodes;
}

/* Returns component from element tag and attributes.
NOTE This is simply a special component factory that ignores children 
(cruel world...) */
function componentFromElement(node) {
  const result = component[node.tagName.toLowerCase()]();
  for (const { name, value } of Array.from(node.attributes)) {
    result.setAttribute(name, value);
  }
  return result;
}

/* Returns component interpretation of native html element. */
function elementToComponent(node) {
  const result = componentFromElement(node);
  const stack = Array.from(node.childNodes, (c) => [result, c]).reverse();
  while (stack.length) {
    const [target, source] = stack.pop();
    if (source.nodeType === Node.TEXT_NODE) {
      target.append(document.createTextNode(source.textContent));
      continue;
    }
    if (source.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    const _target = componentFromElement(source);
    target.append(_target);
    /* Push children onto stack in reverse order */
    stack.push(...Array.from(source.childNodes, (c) => [_target, c]).reverse());
  }
  return result;
}

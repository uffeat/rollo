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
const Factory = (tag) => {
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
      if (tag === "from") {
        return (html, { convert = true } = {}) => {
          if (convert) {
            return fromHtml(html);
          }
          return component[tag]({ innerHTML: html });
        };
      }
      return Factory(tag);
    },
  }
);

function copyAttributes(target, source) {
  for (const { name, value } of Array.from(source.attributes)) {
    target.setAttribute(name, value);
  }
  return target;
}

function convertNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const root = component[node.tagName.toLowerCase()]();

  copyAttributes(root, node);

  const stack = Array.from(node.childNodes, (c) => [root, c]).reverse();

  // Push children of root node onto stack
  for (const child of Array.from(node.childNodes).reverse()) {
    //stack.push([root, child]);
  }

  while (stack.length) {
    const [target, source] = stack.pop();

    if (source.nodeType === Node.TEXT_NODE) {
      target.append(document.createTextNode(source.textContent));
      continue;
    }

    if (source.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    const element = component[source.tagName.toLowerCase()]();

    copyAttributes(element, source);

    target.append(element);

    // Push children onto stack in reverse order
    for (const child of Array.from(source.childNodes).reverse()) {
      stack.push([element, child]);
    }
  }

  return root;
}

export function fromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const nodes = [];
  for (const child of Array.from(template.content.childNodes)) {
    const converted = convertNode(child);
    if (converted) {
      /* Remove empty class attrs */
      if (converted instanceof HTMLElement && !converted.className) {
        converted.removeAttribute("class");
      }
      nodes.push(converted);
    }
  }
  template.innerHTML = "";

  if (nodes.length === 1) {
    return nodes[0];
  }
  const fragment = document.createDocumentFragment();
  fragment.append(...nodes);
  const children = Array.from(fragment.children);
  if (children.length === 1) {
    return children[0];
  }
  return children;
}

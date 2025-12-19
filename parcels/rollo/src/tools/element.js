import { type } from "./type";

/* Updates element.
NOTE Simplified version of web component instance factory. */
export function updateElement(...args) {
  /* Parse args */
  const className = args.find((a, i) => !i && typeof a === "string");
  const text = args.find((a, i) => i && typeof a === "string");
  const updates = args.find((a) => type(a) === "Object") || {};
  const parent = (() => {
    const { parent } = updates;
    if (parent) {
      delete updates.parent;
      return parent;
    }
  })();
  const children = args.filter((a) => a instanceof HTMLElement);
  const hooks = args.filter((a) => typeof a === "function");

  /* Add CSS classes */
  if (className) {
    this.className = className;
  }

  /* Use updates */
  for (const [key, value] of Object.entries(updates)) {
    if (key.startsWith("__") && !key.endsWith("__")) {
      const name = `--${key.slice("__".length)}`;
      if (value === null) {
        this.style.setProperty(name, "none");
      } else {
        this.style.setProperty(name, value);
      }
      continue;
    }
    if (key in this) {
      this[key] = value;
      continue;
    }
    if (key in this.style) {
      if (value === null) {
        this.style[key] = "none";
      } else {
        this.style[key] = value;
      }
      continue;
    }
    if (key.startsWith("_") && !key.endsWith("__")) {
      this[key] = value;
      continue;
    }
    if (key.startsWith("[")) {
      const name = key.slice("[".length, -"]".length);
      setAttribute.call(this, name, value);
      continue;
    }
    if (key.startsWith("data.")) {
      const name = `data-${key.slice("data.".length)}`;
      setAttribute.call(this, name, value);
      continue;
    }
    if (key.startsWith("on.")) {
      const [type, ...rest] = key.slice("on.".length).split(".");
      const options = Object.fromEntries(rest.map((k) => [k, true]));
      this.addEventListener(type, value, options);
      continue;
    }
  }
  /* Add text */
  if (text) {
    this.insertAdjacentText("afterbegin", text);
  }
  /* Parent */
  if (parent && parent !== this.parentElement) {
    parent.append(this);
  }
  /* Append children */
  this.append?.(...children);
  /* Call hooks */
  if (hooks.length) {
    const deferred = [];
    hooks.forEach((h) => {
      const result = h.call(this, this);
      if (typeof result === "function") {
        deferred.push(result);
      }
    });
    if (deferred.length) {
      setTimeout(() => {
        deferred.forEach((h) => h.call(this, this));
      }, 0);
    }
  }
  return this;
}

/* Returns instance factory for HTML element. */
export const element = new Proxy(
  {},
  {
    get(_, tag) {
      return (...args) => {
        const result = document.createElement(tag);
        updateElement.call(result, ...args);
        return result;
      };
    },
  }
);

function setAttribute(name, value) {
  if (value === false || value === null) {
    this.removeAttribute(name);
  } else if (value === true) {
    this.setAttribute(name, "");
  } else {
    this.setAttribute(name, value);
  }
}

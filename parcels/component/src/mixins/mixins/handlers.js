/* TODO
- Refactor run dir, so that an actual event is created. See py code 
 */

export class Handlers {
  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;

    this.#_.on = new Proxy(this, {
      get(target, key) {
        throw new Error(`'on' is write-only.`);
      },
      set(target, key, handler) {
        target.add({ [key]: handler });
        return true;
      },
    });
  }

  /* Adds event handler with `on.type = handler`-syntax. */
  get on() {
    return this.#_.on;
  }

  add(spec = {}) {
    const owner = this.#_.owner;
    Object.entries(spec).forEach(([key, handler]) => {
      const [type, ...dirs] = key.split("$");
      if (dirs.includes("once")) {
        owner.addEventListener(type, handler, { once: true });
      } else {
        owner.addEventListener(type, handler);
      }
      if (dirs.includes("run")) {
        handler({ target: owner });
      }
    });

    return owner;
  }

  remove(spec = {}) {
    Object.entries(spec).forEach(([type, handler]) => {
      this.#_.owner.removeEventListener(type, handler);
    });
    return this.#_.owner;
  }
}

export default (parent, config) => {
  return class extends parent {
    static __name__ = "handlers";
    #_ = {};

    constructor() {
      super();
      this.#_.handlers = new Handlers(this);
    }

    /* Returns controller for managing event handlers. */
    get handlers() {
      return this.#_.handlers;
    }

    /* Adds event handler with `on.type = handler`-syntax. */
    get on() {
      return this.#_.handlers.on;
    }

    addEventListener(type, handler, options) {
      super.addEventListener(type, handler, options);
      return is_arrow(handler) ? handler : this;
    }

    removeEventListener(type, handler, ...args) {
      super.removeEventListener(type, handler, ...args);
      return this;
    }

    /* Adds event handlers from '@'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      this.handlers.add(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith("@"))
            .map(([k, v]) => [k.slice("@".length), v])
        )
      );

      return this;
    }
  };
};

function is_arrow(value) {
  return value.toString().includes("=>");
}

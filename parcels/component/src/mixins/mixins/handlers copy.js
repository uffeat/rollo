import "../../../use.js";
const { type: typeName } = await use("@/tools/type");

const START = "on.".length;

class TaggedSets {
  static create = (...args) => new TaggedSets(...args);

  #_ = {
    registry: new Map(),
  };

  add(key, value) {
    if (this.#_.registry.has(key)) {
      this.#_.registry.get(key).add(value);
    } else {
      const registry = new Set();
      registry.add(value);
      this.#_.registry.set(key, registry);
    }
  }

  values(key) {
    if (this.#_.registry.has(key)) {
      return Array.from(this.#_.registry.get(key).values());
    }
    return [];
  }

  has(key, value) {
    if (this.#_.registry.has(key)) {
      return this.#_.registry.get(key).has(value);
    }
    return false;
  }

  remove(key, value) {
    if (this.#_.registry.has(key)) {
      this.#_.registry.get(key).delete(value);
    }
  }

  size(key) {
    return this.#_.registry.has(key) ? this.#_.registry.get(key).size : 0;
  }
}

export default (parent, config) => {
  return class On extends parent {
    static __name__ = "handlers";
    #_ = {};

    constructor() {
      super();
      const component = this;

      this.#_.handlers = TaggedSets.create()

      this.#_.on = new Proxy(() => {}, {
        /* "point-of-truth" event registration */
        get(_, type) {


          
          return (...args) => {
            const { once, run } =
              args.find((a) => typeName(a) === "Object") || {};
            const handler = args.find((a) => typeName(a) !== "Object");
            component.addEventListener(type, handler, { once });
            if (run) {
              handler({});
            }
            return handler;
          };
        },
        set(_, arg, handler) {
          const parts = arg.split(".");
          const type = parts.at(0);
          component.on[type](
            { once: parts.includes("once"), run: parts.includes("run") },
            handler
          );
          return true;
        },
        apply(_, thisArg, args) {
          const type = args.shift();
          return component.on[type](...args);
        },
      });
    }

    /* Adds event handler with the special on-syntax.
    Examples:
    button.on.click({ once: true }, handler);
    button.on["click.once"] = handler;
    button.on("click", { once: true }, handler);
    */
    get on() {
      return this.#_.on;
    }

    addEventListener(type, handler, ...args) {
      super.addEventListener(type, handler, ...args);
      return this;
    }

    removeEventListener(type, handler, ...args) {
      super.removeEventListener(type, handler, ...args);
      return this;
    }

    /* Adds event handlers from the special on-syntax. */
    update(updates = {}) {
      super.update?.(updates);
      for (const [key, value] of Object.entries(updates)) {
        if (key.startsWith("on.")) {
          const spec = key.slice(START);
          this.on[spec] = value;
        }
      }
      return this;
    }
  };
};

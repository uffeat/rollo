import "../../../use.js";
const { type: typeName } = await use("@/tools/type");
const { TaggedSets } = await use("@/tools/stores");

const START = "on.".length;

class Registry {
  #_ = {};

  constructor(owner) {
    this.#_.registry = TaggedSets.create();
    this.#_.owner = owner;
  }

  add(type, handler) {
    if (!this.#_.registry.has(type, handler)) {
      this.#_.registry.add(type, handler);
    }
  }

  clear(type) {
    const handlers = this.#_.registry.values(type);
    if (handlers) {
      for (const handler of handlers) {
        this.#_.owner.removeEventListener(type, handler);
      }
      this.#_.registry.clear(type);
    }
  }

  has(type, handler) {
    return this.#_.registry.has(type, handler);
  }

  remove(type, handler) {
    if (this.#_.registry.has(type, handler)) {
      this.#_.registry.remove(type, handler);
    }
  }

  size(type) {
    return this.#_.registry.size(type);
  }
}

export default (parent, config) => {
  return class On extends parent {
    static __name__ = "on";
    #_ = {};

    constructor() {
      super();
      const component = this;
      const registry = new Registry(this);
      this.#_.registry = registry;

      this.#_.on = new Proxy(() => {}, {
        get(_, key) {
          if (key === "registry") {
            return registry;
          }
          const type = key;

          const registrator = new (class {
            use(handler, options = {}) {
              return component.addEventListener(type, handler, options);
            }

            unuse(handler, options = {}) {
              return component.removeEventListener(type, handler, options);
            }
          })();

          return registrator;
        },
        set(_, arg, handler) {
          const [type, ...rest] = arg.split(".");
          component.addEventListener(type, handler, Object.fromEntries(rest.map((k) => [k, true])));
          return true;
        },
        apply(_, thisArg, args) {
          return component.addEventListener(...args);
        },
      });
    }

    /* Adds event handler with the special on-syntax.
    Examples:
    button.on.click.use({ once: true }, handler);
    button.on["click.once"] = handler;
    button.on("click", { once: true }, handler);
    */
    get on() {
      return this.#_.on;
    }

    /* "point-of-truth" event handler registration */
    addEventListener(...args) {
      const [type, handler] =
        typeof args[0] === "string" ? args : Object.entries(args[0])[0];
      const {
        once = false,
        run = false,
        track = false,
        ...options
      } = args.find((a, i) => i && typeName(a) === "Object") || {};

      /* NOTE Attempts to track once-handlers are silently ignored */
      if (track && !once) {
        this.#_.registry.add(type, handler);
      }
      super.addEventListener(type, handler, { once, ...options });
      /* NOTE If once AND run the handler will run twice */
      if (run) {
        handler({});
      }
      return {
        self: this,
        handler,
        once,
        remove: () => {
          /* */
          this.removeEventListener(type, handler, { track });
        },
        track,
        type,
        ...options,
      };
    }

    /* "point-of-truth" event handler deregistration */
    removeEventListener(...args) {
      const [type, handler] =
        typeof args[0] === "string" ? args : Object.entries(args[0])[0];
      const { track = false, ...options } =
        args.find((a, i) => i && typeName(a) === "Object") || {};
      if (track) {
        this.#_.registry.remove(type, handler);
      }
      super.removeEventListener(type, handler, options);
      return this;
    }

    /* Adds event handlers from the special on-syntax. */
    update(updates = {}) {
      super.update?.(updates);
      for (const [key, value] of Object.entries(updates)) {
        if (key.startsWith("on.")) {
          const spec = key.slice(START);
          /* Invoke 'get' trap */
          this.on[spec] = value;
        }
      }
      return this;
    }
  };
};

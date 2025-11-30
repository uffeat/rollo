import "../../../use.js";
const { type: typeName } = await use("@/tools/type");
const { TaggedSets } = await use("@/tools/stores");

const START = "on.".length;

/* Controller for handler tracking. */
class Registry {
  #_ = {};

  constructor(owner) {
    this.#_.registry = TaggedSets.create();
    this.#_.owner = owner;
  }

  get types() {
    return this.#_.registry.tags;
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
      this.#_.registry = new Registry(this);

      /* Public version of this.#_.registry */
      const registry = new (class {
        get types() {
          return component.#_.registry.types;
        }

        clear(type) {
          return component.#_.registry.clear(type);
        }

        has(type, handler) {
          return component.#_.registry.has(type, handler);
        }

        size(type) {
          return component.#_.registry.size(type);
        }
      })();

      this.#_.on = new Proxy(() => {}, {
        get(_, key) {
          if (key === "registry") {
            return registry;
          }
          const type = key;
          return new Proxy(() => {}, {
            get(_, key) {
              return (...args) => {
                const handler = args.find((a) => typeof a === "function");
                const options =
                  args.find((a) => typeName(a) === "Object") || {};
                return component[
                  key === "use" ? "addEventListener" : "removeEventListener"
                ](type, handler, options);
              };
            },
            apply(_, thisArg, args) {
              const handler = args.find((a) => typeof a === "function");
              const options = args.find((a) => typeName(a) === "Object") || {};
              return component.addEventListener(type, handler, options);
            },
          });
        },
        set(_, arg, handler) {
          const [type, ...rest] = arg.split(".");
          component.addEventListener(
            type,
            handler,
            Object.fromEntries(rest.map((k) => [k, true]))
          );
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

    /* Registers event handler.
    Overloads original 'addEventListener'. Does not break original API, but 
    handles additional options and returns an object that can be used for later 
    dereg or chaining.
    NOTE "point-of-truth" event handler registration. */
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
        handler();
      }
      return {
        self: this,
        handler,
        once,
        remove: () => {
          /* NOTE 'track' option included. */
          this.removeEventListener(type, handler, { track });
        },
        track,
        type,
        ...options,
      };
    }

    /* Deregisters event handler.
    Overloads original 'removeEventListener'. Does not break original API, but 
    handles additional options and is chainable.
    NOTE "point-of-truth" event handler deregistration. */
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
      for (const [key, handler] of Object.entries(updates)) {
        if (key.startsWith("on.")) {
          const [type, ...rest] = key.slice(START).split(".");
          const options = Object.fromEntries(rest.map((k) => [k, true]));
          this.addEventListener(type, handler, options);
        }
      }
      return this;
    }
  };
};

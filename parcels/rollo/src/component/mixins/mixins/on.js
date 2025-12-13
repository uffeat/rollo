import { type as typeName } from '../../../tools/type'
import { TaggedSets } from "../../../tools/tagged_sets";
import { defineValue } from "../../../tools/define";


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

      /* Public version of this.#_.registry.
      NOTE Exposing this.#_.registry directly would give access to 'add' and 
      'remove', which could mess up tracking. */
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
          /* Enable access to handler registry, e.g.:
          console.log("Number of click handlers:", button.on.registry.size("click"));
          button.on.registry.clear("click");
          */
          if (key === "registry") {
            return registry;
          }
          const type = key;
          return new Proxy(() => {}, {
            /* Enable syntax like:
            button.on.click((event) => console.log("Clicked"));
            button.on.click({ once: true }, (event) => console.log("Clicked"));
            button.on.click.use((event) => console.log("Clicked"));
            button.on.click.unuse((event) => console.log("Clicked"));
            NOTE
            `button.on.click()` and `button.on.click.use()` do exactly the same 
            thing ans as such the 'use' part is redundant. However, does create 
            symmetry with respect to handler by 'unuse':
            `button.on.click.unuse()`
            */
            get(_, key) {
              return (...args) => {
                const handler = args.find((a) => typeof a === "function");
                const options =
                  args.find((a) => typeName(a) === "Object") || {};
                if (key === "use") {
                  return component.addEventListener(type, handler, options);
                }
                if (key === "unuse") {
                  return component.removeEventListener(type, handler, options);
                }
                throw new Error(`Invalid key: ${key}`);
              };
            },
            apply(_, thisArg, args) {
              const handler = args.find((a) => typeof a === "function");
              const options = args.find((a) => typeName(a) === "Object") || {};
              return component.addEventListener(type, handler, options);
            },
          });
        },
        /* Enable syntax like:
        button.on.click((event) => console.log("Clicked"));
        button.on['click.run']((event) => console.log("Clicked"));
        */
        set(_, arg, handler) {
          const [type, ...rest] = arg.split(".");
          component.addEventListener(
            type,
            handler,
            Object.fromEntries(rest.map((k) => [k, true]))
          );
          return true;
        },
        /* Enable syntax like:
        button.on({ click: (event) => console.log("Clicked") });
        button.on({ once: true }, { click: (event) => console.log("Clicked") });
        button.on("click", (event) => console.log("Clicked"));
        button.on("click", (event) => console.log("Clicked"), { once: true });
        */
        apply(_, thisArg, args) {
          return component.addEventListener(...args);
        },
      });
    }

    /* Adds event handler with the special on-syntax. */
    get on() {
      return this.#_.on;
    }

    /* Registers event handler.
    Overloads original 'addEventListener'. Does not break original API, but 
    handles additional options, returns an object that can be used for later 
    dereg or chaining and enables object-based args. "Point-of-truth" event 
    handler registration.
    NOTE 
    - If 'once' AND 'run', the handler will run twice.
    - Attempts to track once-handlers are silently ignored
    */
    addEventListener(...args) {
      const [type, handler] =
        typeof args[0] === "string" ? args : Object.entries(args[0])[0];
      const {
        once = false,
        run = false,
        track = false,
        ...options
      } = args.find((a, i) => i && typeName(a) === "Object") || {};

      /* Track */
      if (track && !once) {
        this.#_.registry.add(type, handler);
      }
      super.addEventListener(type, handler, { once, ...options });

      const result = {
        handler,
        once,
        remove: () => {
          /* NOTE 'track' option included. */
          this.removeEventListener(type, handler, { track });
        },
        run,
        target: this,
        track,
        type,
        ...options,
      };

      /* Run handler (ii-handler).
      We obviously do not readily have an event to pass into the handler, but 
      we can create one by simulation... Mostly as a cool little vanity 
      feature. */
      if (run) {
        /* Create replica component for event harvesting
        ... alt:
        const replica = new (registry.get(this.constructor.__key__))();
        const replica = document.createElement(this.tagName.toLowerCase());
        */
        const replica = this.constructor.create();
        /* Set up listener to harvest event and call ii handler */
        replica.addEventListener(
          type,
          (event) => {
            /* Overwrite target props */
            defineValue(event, "currentTarget", this);
            defineValue(event, "target", this);
            /* Add 'noevent' prop as a means to inform the ii handler that is has 
            not been invoked by an actual event (the 'result' arg also does that) */
            defineValue(event, "noevent", true);
            /* Pass in result to enable advanced dynamic patterns. */
            handler(event, result);
          },
          { once: true }
        );
        /* Trigger replica's event listener */
        if (type.startsWith("_") || type.includes("-")) {
          /* Custom event */
          replica.dispatchEvent(new CustomEvent(type));
        } else {
          /* For browser-native events we only get a truthful event simulation, 
          if we trigger the event programmatically */
          if (
            `on${type}` in replica &&
            type in replica &&
            typeof replica[type] === "function"
          ) {
            replica[type]();
          } else {
            /* Handle other cases */
            replica.dispatchEvent(new Event(type));
          }
        }
      }
      return result;
    }

    /* Deregisters event handler.
    Overloads original 'removeEventListener'. Does not break original API, but 
    handles additional options makes chainable and enables object-based args.
    "Point-of-truth" event handler deregistration. */
    removeEventListener(...args) {
      const [type, handler] =
        typeof args[0] === "string" ? args : Object.entries(args[0])[0];
      const { track = false, ...options } =
        args.find((a, i) => i && typeName(a) === "Object") || {};
      /* Untrack */
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

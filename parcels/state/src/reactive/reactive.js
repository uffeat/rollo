import { Message } from "../tools/message.js";

const { typeName } = await use("@/tools/types.js");

export class Reactive {
  static create = (...args) => new Reactive(...args);

  #_ = {
    change: Object.freeze({}),
    current: {},
    detail: {},
    previous: {},
    registry: new Map(),
    session: null,
  };

  constructor(...args) {
    const reactive = this;
    /* Compose $ */
    this.#_.$ = new Proxy(() => {}, {
      get(target, key) {
        return reactive.#_.current[key];
      },
      set(target, key, value) {
        reactive.update({ [key]: value });
        return true;
      },
      apply(target, thisArg, args) {
        return reactive.update(...args);
      },
      deleteProperty(target, key) {
        reactive.update({ [key]: undefined });
      },
      has(target, key) {
        return key in reactive.#_.current;
      },
    });

    /* Compose config */
    this.#_.config = new (class Config {
      #_ = {
        /* Default match */
        match: (value, other) => {
          return value === other;
        },
      };

      get match() {
        return this.#_.match;
      }

      set match(match) {
        if (match !== undefined) {
          this.#_.match = match;
        }
      }
    })();
    /* Compose effects */
    this.#_.effects = new (class Effects {
      #_ = {};

      constructor(owner, registry) {
        this.#_.owner = owner;
        this.#_.registry = registry;
      }

      get size() {
        return this.#_.registry.size;
      }

      add(effect, ...args) {
        /* Parse args */
        const condition = (() => {
          const condition = args.find((a) => typeof a === "function");
          if (condition) {
            return condition;
          }
          const keys = args.find((a) => Array.isArray(a));
          if (keys) {
            return (change) => {
              for (const key of keys) {
                if (key in change) {
                  return true;
                }
              }
              return false;
            };
          }
        })();

        const {
          data = {},
          once,
          run = true,
        } = args.find((a, i) => !i && typeName(a) === "Object") || {};

        /* Create detail. 
        NOTE detail is kept mutable to enable dynamic reactive patterns. */
        const detail = (() => {
          const detail = { data: { ...data } };
          if (condition) {
            detail.condition = condition;
          }
          if (once) {
            detail.once = once;
          }
          return detail;
        })();
        /* Register */
        this.#_.registry.set(effect, detail);
        /* Handle run */
        if (run) {
          const message = Message.create(this.#_.owner);
          /* Update message */
          message.detail = detail;
          message.effect = effect;
          if (!condition || condition(this.#_.owner.current, message)) {
            effect(this.#_.owner.current, message);
          }
        }
        /* Return effect for later removal */
        return effect;
      }

      clear() {
        this.#_.registry.clear();
      }

      has(effect) {
        return this.#_.registry.has(effect);
      }

      remove(effect) {
        this.#_.registry.delete(effect);
      }
    })(this, this.#_.registry);
    /* Parse args */
    const updates = {
      ...(args.find((a, i) => !i && typeName(a) === "Object") || {}),
    };
    const options = args.find((a, i) => i && typeName(a) === "Object") || {};
    const { config = {}, detail = {}, name, owner } = options;
    const { match } = config;
    const effects = args.filter((a, i) => i && typeof a === "function");
    /* Apply arguments */
    this.#_.owner = owner;
    this.#_.name = name;
    Object.assign(this.detail, detail);
    this.config.match = match;
    this.update(updates);
    for (const effect of effects) {
      this.effects.add(effect);
    }
  }

  get $() {
    return this.#_.$;
  }

  get config() {
    return this.#_.config;
  }

  get change() {
    return this.#_.change;
  }

  get current() {
    return Object.freeze({ ...this.#_.current });
  }

  set current(current) {
    this.clear();
    this.update(current);
  }

  get detail() {
    return this.#_.detail;
  }

  get effects() {
    return this.#_.effects;
  }

  get name() {
    return this.#_.name;
  }

  get owner() {
    return this.#_.owner;
  }

  get previous() {
    return Object.freeze({ ...this.#_.previous });
  }

  get size() {
    return Object.keys(this.#_.current).length;
  }

  get session() {
    return this.#_.session;
  }

  clear(silent = false) {
    const updates = this.keys().map((k) => [k, undefined]);
    return this.update(updates, { silent });
  }

  entries() {
    return Object.entries(this.#_.current);
  }

  /* Tests if other contains the same non-undefined items as current.
  NOTE Does not participate in reactivity, but useful extra, especially for testing. */
  match(other) {
    if (other instanceof Reactive) {
      other = other.current;
    } else {
      if (typeName(other) === "Object") {
        /* Remove items with undefined values */
        other = Object.fromEntries(
          Object.entries(other).filter(([k, v]) => v !== undefined)
        );
      } else {
        return false;
      }
    }
    /* Check size */
    if (this.size !== Object.keys(other).length) return false;
    for (const [key, value] of this.entries()) {
      if (!this.config.match(other[key], value)) return false;
    }
    return true;
  }

  keys() {
    return Object.keys(this.#_.current);
  }

  values() {
    return Object.values(this.#_.current);
  }

  /* Updates current reactively.
  NOTE 
  - Option for updating silently, i.e., non-reactively. */
  update(updates, { detail, silent = false } = {}) {
    if (Array.isArray(updates)) {
      /* Assume entries */
      updates = Object.fromEntries(updates);
    } else if (updates instanceof Reactive) {
      updates = updates.current;
    } else {
      updates = { ...updates };
    }
    if (detail) Object.assign(this.detail, detail);
    /* Infer change and update stores */
    const change = {};
    for (const [key, value] of Object.entries(updates)) {
      /* Ignore no change */
      if (this.config.match(value, this.#_.current[key])) {
        continue;
      }
      /* Handle item removal
      NOTE By convention, undefined deletes */
      if (value === undefined) {
        if (key in this.#_.current) {
          change[key] = value;
          this.#_.previous[key] = this.#_.current[key];
          delete this.#_.current[key];
        }
        continue;
      }
      /* Handle changed item */
      change[key] = value;
      this.#_.previous[key] = this.#_.current[key];
      this.#_.current[key] = value;
    }
    /* Abort if no change */
    if (!Object.keys(change).length) return this;
    /* Update change */
    this.#_.change = Object.freeze(change);
    /* Update session */
    this.#_.session++;
    /* Abort if silent */
    if (silent) return this;
    /* Abort if no effects */
    if (!this.effects.size) return this;
    /* Create message */
    const message = Message.create(this);
    /* Run effects */
    let index = 0;
    for (const [effect, detail] of this.#_.registry.entries()) {
      /* Update message */
      message.detail = detail;
      message.effect = effect;
      message.index = index++;

      const { condition, once } = detail;
      if (!condition || condition(this.change, message)) {
        effect(this.change, message);
        if (once) {
          this.effects.remove(effect);
        }
        if (message.stopped) {
          break;
        }
      }
    }
    return this;
  }
}

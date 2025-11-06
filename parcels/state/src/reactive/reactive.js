import { Message } from "../tools/message.js";

const { typeName } = await use("@/tools/types.js");

export class Reactive {
  static create = (...args) => new Reactive(...args);

  #_ = {
    change: Object.freeze({}),
    detail: {},
    previous: {},
    registry: new Map(),
    session: null,
  };

  constructor(...args) {
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
        const condition = args.find((a) => typeof a === "function");
        const options = args.find((a) => typeName(a) === "Object") || {};
        const { once, run = true } = options;
        /* Create detail. 
        NOTE detail is kept mutable to enable dynamic reactive patterns. */
        const detail = (() => {
          const result = { detail: {} };
          if (condition) {
            result.condition = condition;
          }
          if (once) {
            result.once = once;
          }
          return result;
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
    const current = {...(args.find((a, i) => !i && typeName(a) !== "Object") || {})};
    const options = args.find((a, i) => i && typeName(a) === "Object") || {};
    const { config = {}, detail = {}, name, owner } = options;
    const { match } = config;
    const effects = args.filter((a, i) => i && typeof a === "function");
    /* Apply arguments */
    this.#_.owner = owner;
    this.#_.name = name;
    Object.assign(this.detail, detail);
    this.config.match = match;
    this.update(current);
    for (const effect of effects) {
      this.effects.add(effect);
    }
  }

  get config() {
    return this.#_.config;
  }

  get change() {
    return this.#_.change;
  }

  get current() {
    return Object.freeze(this.#_.current);
  }

  set current(current) {
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
    return Object.freeze(this.#_.previous);
  }

  get session() {
    return this.#_.session;
  }

  clear() {

  }

  /* Updates current reactively.
  NOTE 
  - Option for updating silently, i.e., non-reactively. */
  update(updates, { detail, silent = false } = {}) {
    if (Array.isArray(updates)) {
      updates = Object.fromEntries(updates)
    } else {
      updates = {...updates}
    }
    if (detail) Object.assign(this.detail, detail);
    /* Infer change and update stores */
    const change = {};
    for (const [key, value] of Object.entries(updates)) {
      /* Ignore no change */
      if (this.config.match(value, this.#_.current[key])) {
        continue;
      }
      /* Handle item removal */
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

const Exception  = await use("exception.js");
const { typeName } = await use("@/tools/types.js");



export class Ref {
  static create = (...args) => new Ref(...args);

  #_ = {
    detail: {},
    registry: new Map(),
    session: -1,
  };

  constructor(value, ...args) {
    /* Parse args */
    const options = args.find((a) => typeName(a) === "Object") || {};
    const { config = {}, detail = {}, name, owner } = options;
    const { match } = config;
    const effects = args.filter((a) => typeof a === "function");
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
          const message = Message({
            detail,
            effect,
            owner: this.#_.owner,
            session: this.#_.owner.session,
          });
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
    /* Apply arguments */
    this.#_.owner = owner;
    this.#_.name = name;
    Object.assign(this.detail, detail);
    this.config.match = match;
    this.update(value);
    for (const effect of effects) {
      this.effects.add(effect);
    }
  }

  get config() {
    return this.#_.config;
  }

  get current() {
    return this.#_.current;
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
    return this.#_.previous;
  }

  get session() {
    return this.#_.session;
  }

  update(value, { detail, silent = false } = {}) {
    if (detail) Object.assign(this.detail, detail);
    /* Abort if undefined value */
    if (value === undefined) return this;
    /* Freeze mutable value */
    if (typeName(value) === "Object" || Array.isArray(value)) {
      value = Object.freeze(...value);
    }
    /* Abort if no change */
    if (this.config.match(this.#_.current, value)) return this;
    /* Update stored values and session */
    this.#_.previous = this.#_.current;
    this.#_.current = value;
    this.#_.session++;
    /* Abort if silent */
    if (silent) return this;
    /* Abort if no effects */
    if (!this.effects.size) return this;
    /* Run effects */
    let index = 0;
    for (const [effect, detail] of this.#_.registry.entries()) {
      index++;
      const message = Message({
        effect,
        detail,
        index,
        owner: this,
        session: this.session,
      });
      const { condition, once } = detail;
      if (!condition || condition(this.current, message)) {
        const result = effect(this.current, message);
        if (once) {
          this.effects.remove(effect);
        }
        if (result !== undefined) {
          return result;
        }
      }
    }
    return this;
  }
}

export function ref(...args) {
  const instance = Ref.create(...args);
  return new Proxy(() => {}, {
    get(target, key) {
      Exception.if(!(key in instance), `Invalid key: ${key}`);
      return instance[key];
    },
    set(target, key, value) {
      Exception.if(!(key in instance), `Invalid key: ${key}`);
      instance[key] = value;
      return true;
    },
    apply(target, thisArg, args) {
      return instance.update(...args);
    },
  });
}

function Message({ effect, detail, index = null, owner, session }) {
  return Object.freeze({
    detail,
    effect,
    index,
    owner,
    session,
  });
}

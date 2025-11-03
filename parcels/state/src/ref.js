const { typeName } = await use("@/tools/types.js");

export class Ref {
  static create = (...args) => new Ref(...args);

  #_ = {
    detail: {},
    registry: new Map(),
    session: 0,
  };

  constructor(value, { owner, name } = {}) {
    /* TODO
    - parse to extract options and effects
    - config
    - effects */
    
    this.#_.owner = owner;
    this.#_.name = name;


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
        this.#_.match = match;
      }
    })();

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
        const options =
          args.find((a, i) => !i && typeName(a) === "Object") || {};
        const {once, run} = options;

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
          const message = Message({detail, effect, owner: this.#_.owner})

          if (
            !condition ||
            condition(this.#_.owner.current, message)
          ) {
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

    this.update(value)
  }

  get config() {
    return this.#_.config;
  }

  get current() {
    return this.#_.current;
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

  update(value, { detail, silent = false } = {}) {
    if (detail) {
      Object.assign(this.detail, detail);
    }
    if (value === undefined) return this;
    if (this.config.match(this.#_.current, value)) return this;
    this.#_.previous = this.#_.current;
    this.#_.current = value;
    if (silent || !this.effects.size) return this;
    const session = this.#_.session++;
    let index = 0;
    for (const [effect, detail] of this.#_.registry.entries()) {
      index++;
      const message = Message({ effect, detail, index, owner: this, session });
      const { condition, once } = detail;
      if (!condition || condition(this.current, message)) {
        const result = effect(this.current, message);
        if (once) {
          this.effects.remove(effect)
        }
        if (result !== undefined) {
          return result
        }
      }
    }

    return this;
  }
}

export function ref(value) {
  const instance = Ref.create(value)
  // handle params and return proxy

};

function Message({ effect, detail, index = null, owner, session = null }) {
  Object.freeze({
    detail,
    effect,
    index,
    owner,
    session,
  });
}

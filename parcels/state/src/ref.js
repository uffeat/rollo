const { typeName } = await use("@/tools/types.js");

export class Ref {
  static create = (...args) => new Ref(...args);

  #_ = {
    detail: {},
    registry: new Map(),
    session: 0,
  };

  constructor({ owner, name } = {}) {
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
        /* Create detail */
        const detail = (() => {
          const result = {};
          if (condition) {
            result.condition = condition;
          }
          return result;
        })();
        /* Register */
        this.#_.registry.set(effect, detail);
        /* Handle run */
        if (options.run) {
          const message = Object.freeze({
            index: null,
            session: null,
            owner: this.#_.owner,
          });
          if (
            !detail.condition ||
            detail.condition(this.#_.owner.current, message)
          ) {
            effect(this.#_.owner.current, message);
          }
        }
        return effect;
      }

      has(effect) {
        return this.#_.registry.has(effect);
      }

      remove(effect) {
        this.#_.registry.delete(effect);
      }
    })(this, this.#_.registry);
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

  update(value, { silent = false } = {}) {
    if (this.config.match(this.#_.current, value)) return this;
    this.#_.previous = this.#_.current;
    this.#_.current = value;
    if (silent || !this.effects.size) return this;
    const session = this.#_.session++;

    this.#_.registry.entries().forEach(([effect, detail], index) => {
      const message = Object.freeze({
        effect,
        detail,
        index,
        session,
        owner: this.#_.owner,
      });
      if (
        !detail.condition ||
        detail.condition(this.#_.owner.current, message)
      ) {
        effect(this.#_.owner.current, message);
      }
    });

    return this;
  }
}

export const ref = 42;

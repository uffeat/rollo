import { Message } from "../tools/message.js";

const { typeName } = await use("@/tools/types.js");

export class Ref {
  static create = (...args) => new Ref(...args);

  #_ = {
    detail: {},
    registry: new Map(),
    session: null,
  };

  constructor(...args) {
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
    const current = args.find((a, i) => !i && typeName(a) !== "Object");
    const options = args.find((a) => typeName(a) === "Object") || {};
    const { detail = {}, match = function(other) {return this.current === other}, name, owner } = options;
    const effects = args.filter((a, i) => i && typeof a === "function");
    /* Apply arguments */
    this.match = match;
    this.#_.name = name;
    this.#_.owner = owner;

    Object.assign(this.detail, detail);
   
    this.update(current);
    for (const effect of effects) {
      this.effects.add(effect);
    }
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

  get match() {
    return this.#_.match;
  }

  set match(match) {
    if (match !== undefined) {
      this.#_.match = match.bind(this);
    }
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

  /* Updates current reactively.
  NOTE 
  - Option for updating value silently, i.e., non-reactively. */
  update(value, { detail, silent = false } = {}) {
    if (detail) Object.assign(this.detail, detail);
    /* Abort if undefined value */
    if (value === undefined) return this;
    /* Abort if no change */
    if (this.match(value)) return this;
    /* Update stored values */
    this.#_.previous = this.#_.current;
    this.#_.current = value;
    /* Update session */
    this.#_.session++;
    //console.log('session:', this.session)////
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
      if (!condition || condition(this.current, message)) {
        effect(this.current, message);
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

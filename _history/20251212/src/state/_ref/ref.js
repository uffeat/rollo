import { type } from '@/tools/type'
import { is } from '@/tools/is'
import { Message } from "../_tools/message";

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

      get owner() {
        return this.#_.owner;
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
            return (current) => {
              return keys.includes(current);
            };
          }
        })();

        const {
          data = {},
          once,
          run = true,
        } = args.find((a, i) => !i && type(a) === "Object") || {};
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
    const current = args.find((a, i) => !i && type(a) !== "Object");
    const options = args.find((a) => type(a) === "Object") || {};
    const {
      detail,
      match = function (other) {
        return this.current === other;
      },
      name,
      owner,
    } = options;
    const effects = args.filter((a) => is.arrow(a));
    const hooks = args.filter((a) => !is.arrow(a) && typeof a === "function");
    /* Use arguments */
    this.match = match;
    this.#_.name = name;
    this.#_.owner = owner;
    Object.assign(this.detail, detail);
    this.update(current);
    for (const effect of effects) {
      this.effects.add(effect);
    }
    for (const hook of hooks) {
      hook.call(this);
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
  update(value, { detail, silent = false } = {}, ...args) {
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
      if (!condition || condition(this.current, message, ...args)) {
        effect(this.current, message, ...args);
        if (once) {
          this.effects.remove(effect, ...args);
        }
        if (message.stopped) {
          break;
        }
      }
    }
    return this;
  }
}

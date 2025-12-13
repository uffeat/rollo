import { type } from "../../tools/type";

/* Utility for parsing args in component factory functions. */
class Parse {
  #_ = {};
  constructor(args) {
    this.#_.args = args;
  }

  /* Returns children. */
  get children() {
    if (this.#_.children === undefined) {
      this.#_.children = this.#_.args.filter((a) => a instanceof HTMLElement);
    }
    return this.#_.children;
  }

  /* Returns CSS classes */
  get classes() {
    if (this.#_.classes === undefined) {
      this.#_.classes = this.#_.args.find(
        (a, i) => !i && typeof a === "string"
      );
      /* Enable Tailwind-friendly syntax */
      if (this.#_.classes) {
        this.#_.classes = this.#_.classes
          .split(" ")
          .map((v) => v.trim())
          .filter((v) => !!v)
          .join(".");
      }
    }

    return this.#_.classes;
  }

  /* Returns hooks. */
  get hooks() {
    if (this.#_.hooks === undefined) {
      this.#_.hooks = this.#_.args.filter((a) => typeof a === "function");
      if (!this.#_.hooks.length) {
        this.#_.hooks = null;
      }
    }
    return this.#_.hooks;
  }

  /* Returns text. */
  get text() {
    if (this.#_.text === undefined) {
      this.#_.text = this.#_.args.find((a, i) => i && typeof a === "string");
    }
    return this.#_.text;
  }

  /* Returns updates. */
  get updates() {
    if (this.#_.updates === undefined) {
      this.#_.updates = this.#_.args.find((a, i) => type(a) === "Object") || {};
    }
    return this.#_.updates;
  }
}


/* Returns instance factory function.
NOTE
- target can be a component class (or other constructor function) or a component 
instance. */
export const factory = (target) => {
  return (...args) => {
    /* Parse args */
    args = new Parse(args);

    const instance = typeof target === "function" ? new target(args) : target;

    /* Call '__new__' to invoke pre-config actions */
    instance.constructor.__new__?.call(instance, args);
    instance.__new__?.(args);
    /* Add CSS classes */
    if (instance.classes) {
      instance.classes.add(args.classes);
    }
    /* Use updates */
    instance.update?.(args.updates);
    /* Add text */
    if (args.text) {
      instance.insertAdjacentText("afterbegin", args.text);
    }
    /* Append children */
    instance.append?.(...args.children);
    /* Call '__init__' to invoke post-config actions */
    instance.__init__?.(args);
    instance.constructor.__init__?.call(instance, args);
    /* Call hooks */
    if (args.hooks) {
      const deferred = [];
      args.hooks.forEach((h) => {
        const result = h.call(instance, instance);
        if (typeof result === "function") {
          deferred.push(result);
        }
      });
      if (deferred.length) {
        setTimeout(() => {
          deferred.forEach((h) => h.call(instance, instance));
        }, 0);
      }
    }

    return instance;
  };
};

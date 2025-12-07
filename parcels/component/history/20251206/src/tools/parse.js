//import "../../use.js";////

const { type } = await use("@/tools/type");

/* Utility for parsing args in component factory functions. */
export class Parse {
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

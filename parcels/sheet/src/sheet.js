import { Rules } from "./rules/rules.js";

export class Sheet extends CSSStyleSheet {
  static create = (...args) => new Sheet(...args);

  #_ = {};

  constructor(text, path) {
    super();
    this.#_.rules = Rules.create(this);

    this.#_.targets = new (class Targets {
      static create = (...args) => new Targets(...args);
      #_ = { registry: new Set() };

      constructor(owner) {
        this.#_.owner = owner;
      }

      get _() {
        return this.#_;
      }

      /* Returns owner sheet. */
      get owner() {
        return this.#_.owner;
      }

      /* Adopts owner sheet to target. */
      add(target) {
        if (!this.has(target)) {
          this.#_.registry.add(target);
          target.adoptedStyleSheets.push(this.owner);
        }
      }

      /* Checks, if target has adopted owner sheet. */
      has(target) {
        return this.#_.registry.has(target);
      }

      /* Unadopts owner sheet from target. */
      remove(target) {
        if (this.has(target)) {
          this.#_.registry.delete(target);
          const sheets = target.adoptedStyleSheets;
          for (let i = sheets.length - 1; i >= 0; i--) {
            if (sheets[i] === this.owner) {
              sheets.splice(i, 1);
            }
          }
        }
      }
    })(this);

    this.replaceSync(text);
    this.#_.path = path;
    this.#_.text = text;
  }

  get _() {
    return this.#_;
  }

  /* Returns path (if provided). Useful for soft identification. */
  get path() {
    return this.#_.path;
  }

  get rules() {
    return this.#_.rules;
  }

  /* Returns targets controller. */
  get targets() {
    return this.#_.targets;
  }

  /* Returns text representation of original sheet. */
  get text() {
    return this.#_.text;
  }

  /* Unadopts sheet from targets. */
  unuse(...targets) {
    if (targets.length === 0) {
      targets.push(document);
    }
    for (const _target of targets) {
      const target = _target.shadowRoot || _target;
      this.targets.remove(target);
    }
    return this;
  }

  /* Adopts sheet to targets. */
  use(...targets) {
    if (targets.length === 0) {
      targets.push(document);
    }
    for (const _target of targets) {
      const target = _target.shadowRoot || _target;
      this.targets.add(target);
    }
    return this;
  }
}

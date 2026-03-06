/* Utility for sheet adoption control. */
export class Targets {
  static create = (...args) => new Targets(...args);
  #_ = { registry: new Set() };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Returns owner sheet. */
  get owner() {
    return this.#_.owner;
  }

  /* Returns number of targets. */
  get size() {
    return this.#_.registry.size;
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
}


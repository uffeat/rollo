export class Registry {
  static create = (...args) => new Registry(...args);

  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  get _() {
    return this.#_;
  }

  get owner() {
    return this.#_.owner;
  }

  add(key, value) {
    this.#_.registry.set(key, value);
    return this.owner || this;
  }

  freeze() {
    Object.freeze(this.#_.registry);
    return this.owner || this;
  }

  get(key) {
    return this.#_.registry.get(key);
  }

  has(key) {
    return this.#_.registry.has(key);
  }

  keys() {
    return Array.from(this.#_.registry.keys());
  }

  remove(key) {
    this.#_.registry.delete(key);
    return this.owner || this;
  }

  values() {
    return Array.from(this.#_.registry.values());
  }
}

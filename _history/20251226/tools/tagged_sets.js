/* Top-level Map with dynamic key-Set entries.
NOTE Inspired by Python defaultdict. */
export class TaggedSets {
  static create = (...args) => new TaggedSets(...args);

  #_ = {
    registry: new Map(),
  };

  constructor(registry) {
    if (registry) {
      this.#_.registry = registry;
    }
  }

  get __registry__() {
    return this.#_.registry;
  }

  get tags() {
    return Array.from(this.#_.registry.keys());
  }

  add(key, value) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      registry.add(value);
    } else {
      const registry = new Set();
      registry.add(value);
      this.#_.registry.set(key, registry);
    }
  }

  clear(key) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      registry.clear();
      this.#_.registry.delete(key);
    }
  }

  has(key, value) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      return registry.has(value);
    }
    return false;
  }

  remove(key, value) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      registry.delete(value);
      if (!registry.size) {
        this.#_.registry.delete(key);
      }
    }
  }

  size(key) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      return registry.size;
    }
    /* Return null as empty cue, while still enabling result to participate 
    in arithmetics */
    return null;
  }

  values(key) {
    if (this.#_.registry.has(key)) {
      const registry = this.#_.registry.get(key);
      return Array.from(registry.values());
    }
  }
}

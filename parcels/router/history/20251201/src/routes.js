import "../use.js";

export class Routes {
  static create = (...args) => new Routes(...args);

  #_ = {
    registry: new Map(),
  };

  get size() {
    return this.#_.registry.size;
  }

  add(spec) {
    for (const [path, route] of Object.entries(spec)) {
      this.#_.registry.set(path, route);
    }
  }

  get(path) {
    return this.#_.registry.get(path);
  }

  has(path) {
    return this.#_.registry.has(path);
  }

  remove(path) {
    return this.#_.registry.delete(path);
  }
}

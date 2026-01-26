import "../../use";

export class Routes {
  #_ = {
    registry: new Map(),
  };

  get size() {
    return this.#_.registry.size;
  }

  add(...args) {
    const path = args.at(0);
    const route = args.at(1);
    const config = args.at(2);
    this.#_.registry.set(path, { route });
    return this;
  }

  async get(path) {
    const stored = this.#_.registry.get(path);
    const route = stored.route;
    /* Do setup once */
    if (!stored.setup) {
      const page = route.page;
      if (page instanceof HTMLElement && page.attribute) {
        /* Expose base path as page attr */
        page.attribute.page = path;
      }
      if (typeof route.setup === "function") {
        await route.setup(path);
      }
      stored.setup = true;
    }
    return route;
  }

  has(path) {
    return this.#_.registry.has(path);
  }

  remove(path) {
    return this.#_.registry.delete(path);
  }
}

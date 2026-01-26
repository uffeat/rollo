import "../../use";

export class Route {
  static create = (...args) => new Route(...args);

  #_ = {};

  constructor({ page, path } = {}) {
    this.#_.page = page;
    this.#_.path = path;
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {}

  async enter(meta, url, ...paths) {}

  update(meta, query, ...paths) {}

  async exit(meta) {
    this.page.remove();
  }
}

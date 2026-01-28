import "../../use";

export class Route {
  static create = (...args) => new Route(...args);

  #_ = {};

  constructor({ enter, exit, page, path, setup, update } = {}) {
    if (enter) {
      this.#_.enter = enter;
    }
    if (exit) {
      this.#_.exit = exit;
    } else {
      this.#_.exit = (meta) => this.page.remove();
    }
    if (page) {
      this.#_.page = page;
    }
    if (path) {
      this.#_.path = path;
    }
    if (setup) {
      this.#_.setup = setup;
    }
    if (update) {
      this.#_.update = update;
    }
  }

  get page() {
    return this.#_.page;
  }

  get path() {
    return this.#_.path;
  }

  async setup(base) {
    if (this.#_.setup) {
      return await this.#_.setup(base);
    }
  }

  async enter(meta, url, ...paths) {
    if (this.#_.enter) {
      return await this.#_.enter(meta, url, ...paths);
    }
  }

  async update(meta, query, ...paths) {
    if (this.#_.update) {
      return await this.#_.update(meta, query, ...paths);
    }
  }

  async exit(meta) {
    return await this.#_.exit(meta);
  }
}

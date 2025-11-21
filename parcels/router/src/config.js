export class Config {
  static create = (...args) => new Config(...args);

  #_ = {};

  constructor() {
    /* Default error route */
    this.#_.error = async (path) => {
      const mod = await use("/pages/error.js");
      mod.default(path);
    };
  }

  get error() {
    return this.#_.error;
  }

  set error(route) {
    this.#_.error = route;
  }
}

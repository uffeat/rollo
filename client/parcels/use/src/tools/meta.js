export class Meta {
  static create = (...args) => new Meta(...args);

  #_ = {
    detail: {},
  };

  constructor({ env, origin }) {
    this.#_.DEV = !env || env !== "production";
    this.#_.env = env;
    this.#_.origin = origin;
   
  }

  get DEV() {
    return this.#_.DEV;
  }

  get base() {
    return `${this.origin}/_/theme`;
  }

  get detail() {
    return this.#_.detail;
  }

  get env() {
    return this.#_.env;
  }

  get origin() {
    return this.#_.origin;
  }

  set origin(origin) {
    this.#_.origin = origin
  }
}

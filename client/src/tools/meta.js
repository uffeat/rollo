export class Meta {
  static create = (...args) => new Meta(...args);

  #_ = {
    detail: {},
  };

  constructor() {
    this.#_.DEV = location.hostname === "localhost";
  }

  get DEV() {
    return this.#_.DEV;
  }

  get detail() {
    return this.#_.detail;
  }

  get origin() {
    return this.#_.origin;
  }

  set origin(origin) {
    this.#_.origin = origin;
  }
}

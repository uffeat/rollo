export class Meta {
  static create = (...args) => new Meta(...args);

  #_ = {
    detail: {},
  };

  constructor(owner) {
    this.#_.DEV = location.hostname === "localhost";
    this.#_.owner = owner
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

  /* Returns owner sheet. */
  get owner() {
    return this.#_.owner;
  }
}

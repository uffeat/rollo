export class Meta {
  static create = (...args) => new Meta(...args);

  #_ = {
    detail: {},
  };

  constructor(owner) {
    this.#_.DEV = location.hostname === "localhost";
    if (this.DEV) {
      if (location.port === '3869') {
        this.#_.base = ''
      } else {
        this.#_.base = 'http://localhost:3869'
      }
      
    } else {
      this.#_.base = location.origin
    }

    this.#_.owner = owner
  }

  get DEV() {
    return this.#_.DEV;
  }

  get base() {
    return this.#_.base;
  }

  get detail() {
    return this.#_.detail;
  }

  get origin() {
    return this.#_.origin;
  }

  


  get owner() {
    return this.#_.owner;
  }
}

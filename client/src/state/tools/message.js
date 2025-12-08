/* Creates and returns message argument for effects and conditions. */
export class Message {
  static create = (...args) => new Message(...args);
  #_ = {
    index: null,
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  get detail() {
    return this.#_.detail;
  }

  set detail(detail) {
    this.#_.detail = detail;
  }

  get effect() {
    return this.#_.effect;
  }

  set effect(effect) {
    this.#_.effect = effect;
  }

  get index() {
    return this.#_.index;
  }

  set index(index) {
    this.#_.index = index;
  }

  get owner() {
    return this.#_.owner;
  }

  get stopped() {
    return this.#_.stopped;
  }

  stop() {
    this.#_.stopped = true;
  }
}

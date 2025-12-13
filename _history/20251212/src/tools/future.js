/*
const Future = await use('@/tools/future.js');
*/

export class Future {
  static create = (...args) => new Future(...args);

  #_ = {
    detail: {},
    resolved: false,
  };

  constructor(...args) {
    const pwr = Promise.withResolvers();
    this.#_.promise = pwr.promise;
    this.#_.res = pwr.resolve;

    const { detail, name, owner } =
      args.find((a) => typeof a !== "function") || {};
    Object.assign(this.detail, detail);
    this.#_.name = name;
    this.#_.owner = owner;

    this.#_.callback = args.find((a) => typeof a === "function") || null;
  }

  get detail() {
    return this.#_.detail;
  }

  get name() {
    return this.#_.name;
  }

  get owner() {
    return this.#_.owner;
  }

  get promise() {
    return this.#_.promise;
  }

  get resolved() {
    return this.#_.resolved;
  }

  get value() {
    return this.#_.value;
  }

  resolve(value) {
    if (this.resolved) {
      throw new Error(`Already resolved.`);
    }
    this.#_.value = value;
    this.#_.resolved = true;
    this.#_.res(value);
    this.#_.callback?.(value, {
      detail: this.detail,
      name: this.name,
      owner: this.owner,
    });
    return this;
  }
}

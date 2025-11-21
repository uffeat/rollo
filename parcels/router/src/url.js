import { Query } from "./query.js";

export class Url {
  static create = (...args) => new Url(...args);

  #_ = {};

  constructor(specifier) {
    const url = new URL(specifier, location.origin);
   
    this.#_.path = url.pathname;
    const search = url.search;
    this.#_.hash = url.hash;
    this.#_.query = Query.parse(search);

    this.#_.full = search
      ? `${this.path}${search}${this.hash}`
      : `${this.path}${this.hash}`;
  }

  get full() {
    return this.#_.full;
  }

  get hash() {
    return this.#_.hash;
  }

  get path() {
    return this.#_.path;
  }

  get query() {
    return this.#_.query;
  }
}

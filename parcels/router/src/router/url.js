import "../../use";
import { Query } from "../tools/query";

const { is } = await use("@/rollo/");

const match = (target, other) => {
  if (!is.object(target) || !is.object(other)) {
    return false;
  }
  if (Object.keys(target).length !== Object.keys(other).length) {
    return false;
  }
  for (const [key, value] of Object.entries(target)) {
    if (other[key] !== value) {
      return false;
    }
  }
  return true;
};

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

  match(url) {
    return (
      url.path === this.path &&
      url.hash === this.hash &&
      match(url.query, this.query)
    );
  }
}

import "../use.js";

const { reactive, ref } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");

export class States {
  static create = (...args) => new States(...args);

  #_ = {};

  constructor(owner) {
    this.#_.path = ref({ owner, name: "path" });

    this.#_.effects = new Proxy(this, {
      get(target, key) {
        Exception.if(!(key in target), `Invalid key: ${key}.`);
        return target[key].effects;
      },
    });
  }

  get effects() {
    return this.#_.effects;
  }

  get path() {
    return this.#_.path;
  }
}

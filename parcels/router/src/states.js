const { reactive, ref } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");

export class States {
  static create = (...args) => new States(...args);

  #_ = {};

  constructor(owner) {
    this.#_.path = ref({ owner, name: "path" });
    this.#_.query = reactive({}, { owner, name: "query" });
    this.#_.residual = ref({ owner, name: "residual" });

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

  get query() {
    return this.#_.query;
  }

  get residual() {
    return this.#_.residual;
  }
}

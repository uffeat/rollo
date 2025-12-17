import key from "./tools/key";
import submission from "./tools/submission";
import url from "./tools/url";

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

const server = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    this.#_.api = new Proxy(
      {},
      {
        get(_, name) {
          return async (data) => {
            data = { data };
            if (key) {
              data.__key__ = key;
            }
            return owner.#fetch(
              `${url}/_/api/${name}?submission=${submission()}`,
              data
            );
          };
        },
      }
    );

    this.#_.rpc = new Proxy(
      {},
      {
        get(_, name) {
          return async (data = {}) => {
            return owner.#fetch(
              `/api/gate?name=${name}&submission=${submission()}`,
              data
            );
          };
        },
      }
    );
  }

  get api() {
    return this.#_.api;
  }

  get rpc() {
    return this.#_.rpc;
  }

  async #fetch(url, data) {
    const response = await fetch(`${url}`, {
      body: JSON.stringify(data),
      ...options,
    });
    const result = await response.json();
    if ("__error__" in result) {
      console.error("meta:", result.meta);
      throw new Error(result.__error__);
    }
    Object.freeze(result.data);
    Object.freeze(result.meta);
    return Object.freeze(result);
  }
})();

const { api, rpc } = server;
export { server as default, api, rpc };

import key from "./tools/key";
import submission from "./tools/submission";
import url from "./tools/url";

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

/* Utility for calling HTTP-endpoints (`api's`) and Python server functions 
(`rpc's`; via a Vercel serverless function) defined in backend companion app.
NOTE
- Run /api/gate.py` as local server to enable rpc access during DEV.
- Calling `api's` is deliberately done without custom headers and as text,
  intended to skip prefetch for speed. 
- Goes beyond status codes, i.e., server responds with 200 by default. However,
  full traceback info is served in a `__error__` item in the response body for
  both `api` and `rpc` calls.
  Soft errors are by convention served in the response data object as `ok` 
  (Boolean) and/or `message` (String) items. */
const server = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    this.#_.api = new Proxy(
      {},
      {
        get(_, target) {
          return async (data) => {
            data = { data };
            return owner.#fetch(
              `${url}/_/api/main?submission=${submission()}&target=${target}`,
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

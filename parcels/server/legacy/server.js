/*
import { Server, server } from "@/rolloanvil/server.js";
*/

import { meta } from "@/meta.js";

export const Server = new (class {
  #_ = {
    base: `${meta.server.origin}/_/api`,
    options: {
      headers: { "content-type": "text/plain" },
      method: "POST",
    },
    submission: 0,
    timeout: 3000,
  };

  /* */
  async call(name, data = {}, { raw = false, timeout } = {}) {
    const { promise, resolve, reject } = Promise.withResolvers();

    const timer = timeout
      ? setTimeout(
          () => {
            const error = new Error(`'${name}' did not respond in time.`);
            if (meta.env.DEV) {
              reject(error);
            } else {
              resolve(error);
            }
          },
          timeout === true ? this.#_.timeout : timeout
        )
      : null;

    const url = await (async () => {
      if (meta.env.DEV) {
        const key = (await use("/secrets.json")).development.client;
        return `${this.#_.base}/${name}?key=${key}&submission=${this.#_
          .submission++}`;
      }
      return `${this.#_.base}/${name}?submission=${this.#_.submission++}`;
    })();

    const response = await fetch(url, {
      body: JSON.stringify(data), ////
      ...this.#_.options,
    });

    if (raw) {
      const result = await response.text();
      timer && clearTimeout(timer);
      resolve(result);
    } else {
      const result = await response.json();
      /* Check for error cue */
      if ("__error__" in result) {
        timer && clearTimeout(timer);
        const error = new Error(result.__error__);
        if (meta.env.DEV) {
          reject(error);
        } else {
          resolve(error);
        }
      } else {
        timer && clearTimeout(timer);
        resolve(result);
      }
    }

    return promise;
  }
})();

/* Create proxy-version of 'Server.call' */
export const server = new Proxy(
  {},
  {
    get: (target, name) => {
      if (name.startsWith("__") && name.endsWith("__")) {
        name = name.slice(2, -2);
        if (!(name in Server)) {
          throw new Error(`Invalid key: ${name}`);
        }
        return Server[name];
      }
      return (...args) => Server.call(name, ...args);
    },
    set: (target, name, value) => {
      name = name.slice(2, -2);
      if (!(name in Server)) {
        throw new Error(`Invalid key: ${name}`);
      }
      Server[name] = value;

      return true;
    },
  }
);

/* Add support for 's/' assets */
  use.sources.add({
    s: (path, { data, raw, timeout } = {}) => {
      const name = path.path.slice(path.source.length + 1);
      return Server.call(name, data, {raw, timeout})
    },
  });



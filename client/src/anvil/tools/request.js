const { Exception, is } = await use("@/rollo/");

export const request = new (class {
  #_ = {};

  get window() {
    return this.#_.window;
  }

  set window(window) {
    this.#_.window = window;
  }

  /* Returns promise that resolves to iframe target result.
  NOTE This is the work-horse. */
  request(target, data, { timeout } = {}) {
    const { promise, resolve, reject } = Promise.withResolvers();
    /* Create dedicated channel for the specific request */
    const channel = new MessageChannel();
    const timer = (() => {
      if (is.undefined(timeout)) {
        return;
      }
      return setTimeout(() => {
        channel.port1.close();
        reject(new Error(`Timeout for: ${target}`));
      }, timeout);
    })();
    /* Listen for response */
    channel.port1.onmessage = (event) => {
      Exception.if(!is.object(event.data), `Invalid 'event.data' type.`, () =>
        console.error("event.data:", event.data)
      );
      if (!is.undefined(timer)) {
        clearTimeout(timer);
      }
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.data);
      }
      channel.port1.close();
    };
    /* Send request with port2 transferred to iframe */
    this.window.postMessage(
      { type: "request", target, data },
      use.meta.anvil.origin,
      [channel.port2]
    );
    return promise;
  }
})();

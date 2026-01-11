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
  request(name, ...args) {
    /* Parse args to
    - enable kwargs omission 
    - extract special items (Rollo dunder convention) */
    const _kwargs = args.find((a, i) => !i && is.object(a)) || {};
    args = args.filter((a, i) => i || !is.object(a));
    const { __timeout__, ...kwargs } = _kwargs;

    const { promise, resolve, reject } = Promise.withResolvers();
    /* Create dedicated channel for the specific request */
    const channel = new MessageChannel();
    const timer = (() => {
      if (is.undefined(__timeout__)) {
        return;
      }
      return setTimeout(() => {
        channel.port1.close();
        reject(new Error(`Timeout for: ${name}`));
      }, __timeout__);
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
        resolve(event.data.result);
      }
      channel.port1.close();
    };
    /* Send request with port2 transferred to iframe */
    this.window.postMessage(
      { type: "request", name, kwargs, args },
      use.meta.companion.origin,
      [channel.port2]
    );
    return promise;
  }
})();

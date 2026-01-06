/* Sets up iframe that embeds Anvil-served app and returns bridge tools. 
NOTE Intended as a non-visual DOM-aware stateful "super-worker" with non-cors 
restriced access to HTTP-endpoints and access to this app's import engine. */

const { Exception, TaggedSets, app, component, freeze, is } = await use(
  "@/rollo/"
);

const iframe = component.iframe({
  src: `${use.meta.anvil.origin}`,
  slot: "data",
  id: "anvil",
  name: "anvil",
  title: "anvil",
});

/* Get access to contentWindow */
const promise = new Promise((resolve) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });
});
app.append(iframe);
const contentWindow = await promise;

/* Give Anvil app access to assets. */
window.addEventListener("message", async (event) => {
  if (
    event.origin !== use.meta.anvil.origin ||
    !is.object(event.data) ||
    event.data.type !== "use"
  ) {
    return;
  }
  const { specifier } = event.data;
  const port = event.ports[0];
  const spec = await use(specifier, { raw: true, spec: true });
  /* NOTE the 'raw' and 'spec' options ensure that the iframe gets
  the asset as text along with type, so that the iframe can do
  type-dependent asset construction. */
  port.postMessage({ type: "use", spec, specifier });
  port.close();
});

/* */
const receivers = new (class {
  #_ = {
    registry: new TaggedSets(),
  };
  constructor() {
    this.#_.onmessage = (event) => {
      if (
        event.origin !== use.meta.anvil.origin ||
        !is.object(event.data) ||
        event.data.type !== "push"
      ) {
        return;
      }
      const { data, target } = event.data;

      const effects = this.#_.registry.values(target);
      if (effects) {
        if (is.array(data) || is.object(data)) {
          freeze(data);
        }
        for (const effect of effects) {
          effect(data, { effect, name: target });
        }
      }
    };

    this.start;
  }

  get runs() {
    this.#_.runs;
  }

  add(name, effect) {
    this.#_.registry.add(name, effect);
  }

  clear(name) {
    this.#_.registry.clear(name);
  }

  remove(name, effect) {
    this.#_.registry.remove(name, effect);
  }

  start() {
    window.addEventListener("message", this.#_.onmessage);
    this.#_.runs = true;
  }

  stop() {
    window.removeEventListener("message", this.#_.onmessage);
    this.#_.runs = false;
  }
})();

/* Returns promise that resolves to iframe target result.
NOTE This is the work-horse and the core parent->iframe->parent bridge. */
const request = (target, data, { timeout } = {}) => {
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
  /* Listen on port1 for the response */
  channel.port1.onmessage = (event) => {
    Exception.if(
      !is.object(event.data),
      `'event.data' should be a plain object.`,
      () => console.error("event.data:", event.data)
    );
    if (!is.undefined(timer)) {
      clearTimeout(timer);
    }
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(event.data.data);
    }
    /* Clean up */
    channel.port1.close();
  };
  /* Send request with port2 transferred to iframe */
  contentWindow.postMessage(
    { type: "request", target, data },
    use.meta.anvil.origin,
    [channel.port2]
  );
  return promise;
};

/* Wraps 'request' for a more 'RPC-like' DX. */
const anvil = new Proxy(
  {},
  {
    get(_, key) {
      return (...args) => {
        return request(key, ...args);
      };
    },
  }
);

export { anvil, receivers };

const { Exception, app, component, is } = await use("@/rollo/");

/* Sets up iframe that embeds Anvil-served app and returns bridge tools. 
NOTE Intended as a non-visual DOM-aware stateful "super-worker" with non-cors 
restriced access to HTTP-endpoints and access to this app's import engine. */



//const _origin = use.meta.DEV ? "https://rollohdev.anvil.app" : "https://rolloh.anvil.app";
const _origin = "https://rollohdev.anvil.app"

console.log("Loading..."); ////

const iframe = component.iframe({
  src: `${_origin}/index`,
  slot: "data",
  id: "anvil",
  name: "anvil",
});

const { promise, resolve, reject } = Promise.withResolvers();

/* Get access to contentWindow (handshake) */
const _promise = new Promise((resolve) => {
  const onready = (event) => {
    if (event.origin !== _origin || event.data !== "ready") {
      return;
    }
    window.removeEventListener("message", onready);
    resolve(iframe.contentWindow);
  };
  window.addEventListener("message", onready);
});
app.append(iframe);

_promise.then((contentWindow) => {
  /* Provide access to assets. */
  window.addEventListener("message", async (event) => {
    if (
      event.origin !== _origin ||
      !is.object(event.data) ||
      event.data.type !== "use"
    ) {
      return;
    }
    const { specifier } = event.data;
    const spec = await use(specifier, { raw: true, spec: true });
    /* NOTE the 'raw' and 'spec' options ensure that the iframe gets
    the asset as text along with type, so that the iframe can do
    type-dependent asset construction. */
    contentWindow.postMessage({ type: "use", spec, specifier }, _origin);
  });

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
    contentWindow.postMessage({ type: "request", target, data }, _origin, [
      channel.port2,
    ]);
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

  /* Resolve to "pseudo module". Avoids the need for a `if (key === 'then') return` 
    guard in 'anvil'. Also makes it easier to pack in additional "pseudo members".
    Store on 'iframe.detail' to enable access via DOM and to exploit 'iframe.detail'.  */
  const result = Object.freeze(
    Object.assign(iframe.detail, { anvil, origin: _origin, request })
  );
  resolve(result);

  console.log("Loaded"); ////
});

export { promise as default };

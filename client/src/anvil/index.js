/* Sets up iframe that embeds Anvil-served app and returns bridge tools. 
NOTE Intended as a non-visual DOM-aware stateful "super-worker" with non-cors 
restriced access to HTTP-endpoints and access to this app's import engine. */

const {
  Exception,
  Reactive,
  TaggedSets,
  app,
  component,
  match,
  merge,
  freeze,
  is,
} = await use("@/rollo/");

const iframe = component.iframe({
  src: `${use.meta.anvil.origin}/embedded?foo=42&bar&stuff`,
  slot: "data",
  id: "anvil",
  name: "anvil",
  title: "anvil",
});

/* Give Anvil app access to assets. 
NOTE Flow: iframe -> parent -> iframe. */
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

/* Wrapped version of 'Reactive' updated by iworker. 
NOTE Flow: iframe -> parent. */
const receiver = new (class {
  #_ = {
    state: new Reactive(),
  };
  constructor() {
    this.#_.onmessage = (event) => {
      if (
        event.origin !== use.meta.anvil.origin ||
        !is.object(event.data) ||
        event.data.type !== "receiver"
      ) {
        return;
      }
      const { data } = event.data;
      Exception.if(!is.object(event.data), `Invalid 'event.data' type.`, () =>
        console.error("event.data:", event.data)
      );
      this.#_.state.update(data);
    };

    this.start();
  }

  get active() {
    return this.#_.active;
  }

  get computed() {
    return this.#_.state.computed;
  }

  get change() {
    return this.#_.state.change;
  }

  get current() {
    return this.#_.state.current;
  }

  get effects() {
    return this.#_.state.effects;
  }

  get previous() {
    return this.#_.state.previous;
  }

  get size() {
    return this.#_.state.size;
  }

  get session() {
    return this.#_.state.session;
  }

  start() {
    window.addEventListener("message", this.#_.onmessage);
    this.#_.active = true;
  }

  stop() {
    window.removeEventListener("message", this.#_.onmessage);
    this.#_.active = false;
  }
})();

/* Somewhat similar to 'receiver', but 
- stateless (except for queue)
- not limited to flat objects
- effects orgnaised across any number of 'tags' (i.e., "channels"/"domains")
- no change-detection
- no conditional effects.
NOTE 
Flow: iframe -> parent.
Consuming code can implement change-detection, conditional effects etc.
*/
const receivers = new (class {
  #_ = {
    registry: new TaggedSets(),
    queue: new Map(),
  };
  constructor() {
    const owner = this;
    this.#_.onmessage = (event) => {
      if (
        event.origin !== use.meta.anvil.origin ||
        !is.object(event.data) ||
        event.data.type !== "receivers"
      ) {
        return;
      }
      const { data, target } = event.data;
      Exception.if(
        !is.object(event.data) && !is.array(event.data),
        `Invalid 'event.data' type.`,
        () => console.error("event.data:", event.data)
      );

      const effects = this.#_.registry.values(target);
      if (effects) {
        if (this.#_.queue.has(target)) {
          merge(data, this.#_.queue.get(target));
          this.#_.queue.delete(target);
        }
        freeze(data);
        for (const effect of effects) {
          effect(data, { effect, name: target });
        }
      } else {
        if (this.#_.queue.has(target)) {
          merge(data, this.#_.queue.get(target));
        } else {
          this.#_.queue.set(target, data);
        }
      }
    };

    this.#_.effects = new (class {
      add(name, effect) {
        owner.#_.registry.add(name, effect);
      }

      clear(name) {
        owner.#_.registry.clear(name);
      }

      remove(name, effect) {
        owner.#_.registry.remove(name, effect);
      }
    })();

    this.start();
  }

  get active() {
    return this.#_.active;
  }

  get effects() {
    return this.#_.effects;
  }

  start() {
    window.addEventListener("message", this.#_.onmessage);
    this.#_.active = true;
  }

  stop() {
    window.removeEventListener("message", this.#_.onmessage);
    this.#_.active = false;
  }
})();

/* Get access to contentWindow */
const promise = new Promise((resolve, reject) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });
});
app.append(iframe);
const contentWindow = await promise;

/* Returns promise that resolves to iframe target result.
NOTE This is the work-horse.
Flow: parent -> iframe -> parent. */
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

const run = async (path, ...args) => {
  const text = await use(path);
  const kwargs = args.find((a, i) => !i && is.object(a)) || {};
  args = args.filter((a, i) => i || !is.object(a));
  const { promise, resolve, reject } = Promise.withResolvers();
  const channel = new MessageChannel();
  channel.port1.onmessage = (event) => {
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(event.data.data);
    }
    channel.port1.close();
  };

  contentWindow.postMessage(
    { type: "run", text, args, kwargs },
    use.meta.anvil.origin,
    [channel.port2]
  );
  return promise;
};

const _run = (text, path, kwargs, ...args) => {
  const { promise, resolve, reject } = Promise.withResolvers();
  const channel = new MessageChannel();
  channel.port1.onmessage = (event) => {
    if (event.data.error) {
      reject(event.data.error);
    } else {
      resolve(event.data.data);
    }
    channel.port1.close();
  };
  contentWindow.postMessage(
    { type: "run", text, path, args, kwargs },
    use.meta.anvil.origin,
    [channel.port2]
  );
  return promise;
};

use.types.add("py", (text, { path }) => {
  //console.log("path.path:", path.path); ///
  return (kwargs, ...args) => {
    return _run(text, path.path, kwargs, ...args);
  };
});

use.redirects.add((specifier, options, ...args) => {
  if (specifier.startsWith("@/") && specifier.endsWith(".py")) {
    return `/parcels${specifier.slice(1)}`;
  }
});

/* Wraps 'request' for a more 'RPC-like' DX. */
const anvil = new Proxy(
  {},
  {
    get(_, key) {
      if (key === "receiver") {
        return receiver;
      }
      if (key === "receivers") {
        return receivers;
      }
      return (...args) => {
        return request(key, ...args);
      };
    },
  }
);

if (import.meta.env.DEV) {
  const BROKEN = 3000;
  const SLOW = 1000;
  const test = (timeout, { retry = true } = {}) => {
    const expected = crypto.randomUUID();
    anvil
      .echo(expected, { timeout })
      .then((echo) => {
        Exception.if(echo !== expected, `Incorrect echo.`);
        console.info("Connection verified.");
      })
      .catch((error) => {
        if (retry) {
          console.warn(`Verifying again in the background...`);
          test(BROKEN, { retry: false });
        } else {
          console.error(error);
          throw new Error(`Connection could not be verified.`);
        }
      });
  };
  console.info("Verifying Anvil connection in the background...");
  test(SLOW, { retry: true });
}

export { anvil, run };

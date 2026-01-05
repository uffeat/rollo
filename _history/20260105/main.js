/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

if (window !== window.parent) {
  const {
    Exception,
    app,
    Sheet,
    component,
    element,
    css,
    router,
    typeName,
    is,
  } = await use("@/rollo/");

  /*
  const _origin = use.meta.DEV
    ? "https://rollohdev.anvil.app"
    : "https://rolloh.anvil.app";
  */
 const _origin = "https://rollohdev.anvil.app";

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
    /* Send request with port2 transferred to parent */
    window.parent.postMessage({ type: "request", target, data }, _origin, [
      channel.port2,
    ]);
    return promise;
  };

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

  window.addEventListener("message", async (event) => {
    console.log("event.origin:", event.origin); ////
    if (
      event.origin !== _origin ||
      !is.object(event.data) ||
      event.data.type !== "router"
    ) {
      return;
    }
    const { path } = event.data;
    await router.use(path);
  });

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
    window.parent.postMessage({ type: "use", spec, specifier }, _origin);
  });

  /* Test */
  await (async () => {
    const result = await anvil.echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await anvil.echo("foo");
    console.log("result:", result);
  })();
}

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

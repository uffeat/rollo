const parentOrigin = "http://localhost:3869";

const typeName = (value) => Object.prototype.toString.call(value).slice(8, -1);

const targets = {
  echo(data) {
    return data;
  },
};

if (window === window.parent) {
  // Perhaps do some testing here...
} else {
  const use = (() => {
    /* Recreate native 'import' to prevent Vite from barking. */
    const _import = Function("u", "return import(u)");
    /* Returns constructed module */
    const Module = async (text, path) => {
      text = `${text}\n//# sourceURL=${path}`;
      const url = URL.createObjectURL(
        new Blob([text], { type: "text/javascript" })
      );
      const result = await _import(url);
      URL.revokeObjectURL(url);
      return result;
    };
    /* Create combined cache and inflight map.  */
    const store = new Map();
    return async (specifier) => {
      if (store.has(specifier)) {
        const stored = store.get(specifier);
        if (stored instanceof Promise) {
          const result = await stored;
          store.set(specifier, result);
          return result;
        }
        return stored;
      }
      const { promise, resolve, reject } = Promise.withResolvers();
      store.set(specifier, promise);

      const onuse = async (event) => {
        /* Parent guard */
        if (
          event.origin !== parentOrigin ||
          typeName(event.data) !== "Object" ||
          event.data.type !== "use" ||
          event.data.specifier !== specifier
        ) {
          return;
        }
        const { spec } = event.data;

       
        const { text, type } = spec;
        let result;
        if (type === "js") {
          result = await Module(text, specifier);
        } else {
          result = text;
        }
        window.removeEventListener("message", onuse);
        store.set(specifier, result);
        resolve(result);
      };
      window.addEventListener("message", onuse);
      window.parent.postMessage({ type: "use", specifier }, parentOrigin);

      return promise;
    };
  })();

  window.addEventListener("message", async (event) => {
    /* Parent guard */
    if (event.origin !== parentOrigin) {
      return;
    }
    if (typeName(event.data) === "Object") {
      /* Handle request-type events */
      if (event.data.type === "request") {
        const { target } = event.data;

        const port = event.ports[0];
        if (!(target in targets)) {
          port.postMessage({ error: new Error(`Invalid target: ${target}`) });
          port.close();
          return;
        }
        try {
          const data = await targets[target](event.data.data);
          /* Send response to parent through dedicated port */
          port.postMessage({ data });
        } catch (error) {
          port.postMessage({ error });
        } finally {
          /* Clean up */
          port.close();
        }
        return;
      }
      // Handle other types here
    }
  });

  window.parent.postMessage("ready", parentOrigin);

  /* Test */

  /*
  const { element, component, app } = await use("@/rollo/");
  console.log("element:", element); ////

  const myComponent = component.div();
  console.log("myComponent:", myComponent); ////
  console.log("app:", app); ////

  const foo = await use("/test/foo.template");
  console.log("foo:", foo); ////

  const { d3 } = await use("@/d3");
  console.log("d3:", d3); ////

  const { Plotly } = await use("/plotly/");
  console.log("Plotly:", Plotly); ////
  */
}

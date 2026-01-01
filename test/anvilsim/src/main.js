const parentOrigin = "http://localhost:3869";

const typeName = (value) => Object.prototype.toString.call(value).slice(8, -1);

const _import = Function("u", "return import(u)");

const Module = async (text, path) => {
  if (path) {
    text = `${text}\n//# sourceURL=${path}`;
  }
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/javascript" })
  );
  const result = await _import(url);
  URL.revokeObjectURL(url);
  return result;
};

const targets = {
  echo(data) {
    return data;
  },
};

if (window === window.parent) {
  // Perhaps do some testing here?
} else {
  /*  */
  const cache = new Map();
  const constructing = new Map();

  const use = async (specifier) => {
    if (cache.has(specifier)) {
      return cache.get(specifier);
    }

    if (constructing.has(specifier)) {
      const promise = constructing.get(specifier);
      const result = await promise;
      constructing.delete(specifier);
      return result;
    }

    const { promise, resolve, reject } = Promise.withResolvers();
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
      const construction = Promise.withResolvers();
      constructing.set(specifier, construction.promise);

      const { data } = event.data;
      //console.log("data:", data); ////

      const result = await Module(data);
      //console.log("mod:", mod); ////

      window.removeEventListener("message", onuse);
      construction.resolve(result);
      cache.set(specifier, result);
      resolve(result);
    };
    window.addEventListener("message", onuse);

    window.parent.postMessage({ type: "use", specifier }, parentOrigin);

    return promise;
  };

  window.addEventListener("message", async (event) => {
    /* Parent guard */
    if (event.origin !== parentOrigin) {
      return;
    }
    if (typeName(event.data) === "Object") {
      /* Handle requests */
      if (event.data.type === "request") {
        const { target, id, data } = event.data;
        const _target = targets[target];
        const _data = await _target(data);
        window.parent.postMessage(
          { type: "response", id, target, data: _data },
          parentOrigin
        );
        return;
      }

      /* Handle use here??? */

      // Perhaps handle other types here
    }
  });

  window.parent.postMessage("ready", parentOrigin);

  /* Test */
  const { element } = await use("@/rollo/");
  console.log("element:", element); ////
}

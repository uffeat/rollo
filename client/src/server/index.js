let __key__;
if (import.meta.env.DEV) {
  __key__ = (await import("../../../secrets.json")).default.development.server;
}


// TODO base url for env

const submission = (() => {
  let submission = 0;
  return () => submission++;
})();

const options = {
  method: "POST",
  headers: { "content-type": "text/plain; charset=utf-8" },
};

export const rpc = new Proxy(
  {},
  {
    get(_, name) {
      return async (data) => {
        const response = await fetch(
          `/api/gate?name=${name}&submission=${submission()}`,
          {
            body: JSON.stringify(data || {}),
            ...options,
          }
        );
        const result = await response.json();
        if ("__error__" in result) {
          console.error("meta:", result.meta);
          throw new Error(result.__error__);
        }
        Object.freeze(result.data);
        Object.freeze(result.meta);
        return Object.freeze(result);
      };
    },
  }
);

export const api = new Proxy(
  {},
  {
    get(_, name) {
      return async (data) => {

        const body = {
          data,
        };
        if (__key__) {
          body.__key__ = __key__
        }

        const response = await fetch(
          `https://rollohdev.anvil.app/_/api/${name}?submission=${submission()}`,
          {
            body: JSON.stringify(body),
            ...options,
          }
        );
        const result = await response.json();
        if ("__error__" in result) {
          console.error("meta:", result.meta);
          throw new Error(result.__error__);
        }
        Object.freeze(result.data);
        Object.freeze(result.meta);
        return Object.freeze(result);
      };
    },
  }
);

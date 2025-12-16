const submission = (() => {
  let submission = 0;
  return () => submission++;
})();

export const rpc = new Proxy(
  {},
  {
    get(_, name) {
      return async (data) => {
        const response = await fetch(
          `/api/gate?name=${name}&submission=${submission()}`,
          {
            method: "POST",
            headers: { "content-type": "text/plain; charset=utf-8" },
            body: JSON.stringify(data || {}),
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

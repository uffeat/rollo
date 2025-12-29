/** DEV testbench */

/* Returns function that runs test from path */
const run = (() => {
  const START = "./tests".length;
  const loaders = Object.fromEntries(
    Object.entries({
      ...import.meta.glob("./tests/**/*.test.js"),
      ...import.meta.glob("./tests/**/*.x.html", {
        import: "default",
        query: "?raw",
      }),
    }).map(([k, v]) => {
      return [k.slice(START), v];
    })
  );

  //console.log("loaders:", loaders);////

  /* Add 'tests' source to import engine */
  use.sources.add("tests", async ({ path }) => {
    if (!(path.path in loaders)) {
      throw new Error(`Invalid path:${path.full}`);
    }
    return await loaders[path.path]();
  });
  return async (path) => {
    const asset = await use(`tests${path}`);
    await asset.default();
  };
})();

/* Trigger test from shortcut */
(() => {
  const KEY = "__test__";
  window.addEventListener(
    "keydown",
    (() => {
      return async (event) => {
        /* Unit tests */
        if (event.code === "KeyU" && event.shiftKey) {
          const path = prompt("Path:", localStorage.getItem(KEY) || "");
          localStorage.setItem(KEY, path);
          await run(path);
        }
      };
    })()
  );
})();

export {};



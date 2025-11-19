import "../../../client/src/use.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.add("@/router.js", parcel);

document.documentElement.dataset.bsTheme = "dark";

//const { layout } = await use("@/layout/");

/* Add page modules to import engine for testing.
NOTE Also demos, how non-@/ assets can be batch-converted to partake in 
routing. */
await (async () => {
  const START = "./assets".length;
  const entries = Object.entries({
    ...import.meta.glob("./assets/**/*.js"),
  });
  for (const [k, v] of entries) {
    use.add(`@${k.slice(START)}`, await v());
  }
})();

/* Demo how a single @@/ asset can be converted to partake in routing. */
await (async () => {
  use.add("@/bar.js", async () => {
    return await use("@@/bar.js");
  });
})();

/* Add 'tests' source to import engine */
use.sources.add(
  "tests",
  (() => {
    const START = "./tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("./tests/**/*.js"),
        ...import.meta.glob("./tests/**/*.html", {
          import: "default",
          query: "?raw",
        }),
      }).map(([k, v]) => {
        return [k.slice(START), v];
      })
    );
    return async ({ owner, path }) => {
      const { Exception } = await owner.get("@/tools/exception.js");
      Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
      return await loaders[path.path]();
    };
  })()
);

/* Runs test. */
const run = async (path) => {
  if (!path || path === "/") return;
  const asset = await use(`tests${path}`);
  await asset?.default(parcel);
};

/* Add test control */
window.addEventListener(
  "keydown",
  (() => {
    const KEY = "__test__";
    return async (event) => {
      /* Unit tests */
      if (event.code === "KeyU" && event.shiftKey) {
        const path = prompt("Path:", localStorage.getItem(KEY) || "");
        localStorage.setItem(KEY, path);
        await run(path);
      }
      if (event.code === "KeyC" && event.shiftKey) {
        //layout.clear();
        document.adoptedStyleSheets = [];
        history.pushState({}, "", "/"); //
      }
    };
  })()
);

//
//
await run("/basics.js");

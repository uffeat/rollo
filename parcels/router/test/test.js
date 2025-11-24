/* Overload to use live parcel */
import * as parcel from "../index.js";
use.add("@/router/router.js", parcel);

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");
if (use.meta.DEV) {
  await use("/dev.css");
}

/* Inject page assets into import engine for testing. */
Object.entries({
  ...import.meta.glob("./pages/**/*.html", {
    import: "default",
    query: "?raw",
  }),
}).forEach(([k, load]) => {
  use.add(`${k.slice(1)}`, load);
});

const pages = (() => {
  const START = "./pages".length;
  const pages = Object.fromEntries(
    Object.entries(import.meta.glob("./pages/**/*.js")).map(([k, load]) => {
      const path = `${k.slice(START, -3)}`;
      return [path, load];
    })
  );
  const home = pages[`/home`];
  if (home) {
    pages["/"] = home;
  }
  return pages;
})();

//console.log("pages:", pages);

/* Add 'tests' source to import engine */
await (async () => {
  const { Exception } = await use("@/tools/exception.js");
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
  use.sources.add("tests", async ({ owner, path }) => {
    Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
    return await loaders[path.path]();
  });
})();

/* Runs test. */
const run = async (path) => {
  if (!path || path === "/") return;
  const asset = await use(`tests${path}`);
  const test = asset?.default ?? asset;
  await test({pages});
};

/* Add test control */
await (async () => {
  const { layout } = await use("@/layout/");
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
        if (event.code === "KeyC" && event.shiftKey) {
          layout.clear();
          document.adoptedStyleSheets = [];
          history.replaceState({}, "", "/"); //
        }
      };
    })()
  );
})();

//
//
//await run("/basics.x.html");

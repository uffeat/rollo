/* Initialize import engine */
import "../use.js";
/* Activate global Tailwind */
import "./test.css";
/* Activate local Tailwind */
import "../../../client/src/main.css"



/* Overload to use live parcel */
import * as parcel from "../index.js";
use.add("@/component.js", parcel);

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");
if (use.meta.DEV) {
  await use("/dev.css");
}

/* Add 'tests' source to import engine */
await (async () => {
  const { Exception } = await use("@/tools/exception");
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
  if (!path) return;
  history.replaceState({}, "", path); //
  const asset = await use(`tests${path}`);
  const test = asset?.default ?? asset;
  await test(parcel);
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
          history.replaceState({}, "", "/"); //
          layout.clear();
          document.adoptedStyleSheets = [];
        }
      };
    })()
  );
})();

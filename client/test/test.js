/* Testbench.

Runs on:
http://localhost:3869/test/test.html

NOTE 
- Test scripts can access
  - unbuilt parcels
  - built parcels
  - public assets
  - assets
*/

/* Initialize import engine */
import "../src/use.js";
/* Activate Tailwind */
import "../src/main.css";

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");
if (use.meta.DEV) {
  await use("/dev.css");
}

/* Add 'tests' source to import engine */
await (async () => {
  const { Exception } = await use("@/tools/exception.js");
  const START = "./tests".length;
  const loaders = Object.fromEntries(
    Object.entries({
      ...import.meta.glob("./tests/**/*.js"),
     
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
  await asset.default();
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
        document.adoptedStyleSheets = [];
        history.pushState({}, "", "/"); //
      }
    };
  })()
);

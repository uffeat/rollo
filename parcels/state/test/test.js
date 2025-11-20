import "../../../client/src/use.js";
import * as parcel from "../index.js";

const { app } = await use("@/app/");
const { layout } = await use("@/layout/");

/* Overload to use live parcel */
use.add("@/router.js", parcel);

document.documentElement.dataset.bsTheme = "dark";
layout.close(false);

//const icon = await use('/icons/upload.svg', {timeout: 1})
//console.log('icon:', icon)

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
      if (path.type === "js") Object.assign(path.detail, { escape: true });
      return await loaders[path.path]();
    };
  })()
);

const run = async (path) => {
  if (!path || path === "/") return;
  const asset = await use(`tests${path}`);
  await asset?.default(parcel);
};

window.addEventListener(
  "keydown",
  (() => {
    const KEY = "__test__";
    return async (event) => {
      /* Unit tests */
      if (event.code === "KeyU" && event.shiftKey) {
        const path = prompt("Path:", localStorage.getItem(KEY) || "");
        localStorage.setItem(KEY, path);
        history.pushState({}, "", path || "/");
        await run(path);
      }
      if (event.code === "KeyC" && event.shiftKey) {
        history.pushState({}, "", "/");
        layout.clear();
        document.adoptedStyleSheets = [];
      }
    };
  })()
);

await run(location.pathname);

window.addEventListener("popstate", async (event) => {
  await run(location.pathname);
});

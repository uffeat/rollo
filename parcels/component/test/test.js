import "../../../client/src/use/use.js";

import * as exports from "../index.js";
/* Overload */
use.assets.add("@/component.js", exports);

const STORAGE_KEY = "__test__";



const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

document.querySelector("html").dataset.bsTheme = "dark";

const setup = async ({ prefix = "./tests/", report, tests }, tools) => {
  window.addEventListener("keydown", async (event) => {
    /* Unit tests */
    if (event.code === "KeyU" && event.shiftKey) {
      const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
      if (path) {
        localStorage.setItem(STORAGE_KEY, path);
        const key = `${prefix}${path}`;
        if (!(key in tests)) {
          throw new Error(`Invalid path: ${path}.`);
        }
        const load = tests[key];
        const loaded = await load();
        const test = loaded.default;
        const result = await test(tools);

        if (result !== undefined) {
          if (report) {
            await report({ path, result, test }, tools);
          }
        }
      }
    }
  });
};

await setup(
  {
    tests: {
      ...import.meta.glob("./tests/**/*.js"),
      ...import.meta.glob("./tests/**/*.html", {
        query: "?raw",
      }),
    },
    report: async ({ path, result, test }) => {},
  },
  { component }
);

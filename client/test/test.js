/* Test bench.

NOTE 
- ...pretty unique, this module has access to unbuilt as well as built 
parcels and can therefore instigate tests based on either!

 TODO
- html-based test scripts
- batch tests
*/

import "../src/main.js";

const STORAGE_KEY = "__test__";

const tests = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("./tests/**/*.js"),
    ...import.meta.glob("./tests/**/*.html", {
      query: "?raw",
    }),
  }).map(([k, v]) => [k.slice("./tests/".length), v])
);

console.log("tests:", tests);

window.addEventListener("keydown", async (event) => {
  /* Unit tests */
  if (event.code === "KeyU" && event.shiftKey) {
    const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
    if (path) {
      localStorage.setItem(STORAGE_KEY, path);

      if (!(path in tests)) {
        throw new Error(`Invalid path: ${path}.`);
      }
      const load = tests[path];
      const mod = await load();
      await mod.default();
    }
  }
  /* Batch tests */
  if (event.code === "KeyT" && event.shiftKey) {
    //
  }
});

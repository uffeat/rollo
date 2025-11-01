/* Testbench.
http://localhost:8080/test/test.html

NOTE 
- Test scripts can access to unbuilt as well as built 
parcels.

 TODO
- html-based test scripts
- batch tests
*/

import "../src/use/use.js";

document.querySelector("html").dataset.bsTheme = "dark";

const STORAGE_KEY = "__test__";

const tests = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("./tests/**/*.js"),
    ...import.meta.glob("./tests/**/*.html", {
      query: "?raw",
    }),
  }).map(([k, v]) => [k.slice("./tests/".length), v])
);

//console.log("tests:", tests);////

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

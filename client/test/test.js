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

import "../src/use.js";


document.querySelector("html").dataset.bsTheme = "dark";

const STORAGE_KEY = "__test__";
const PREFIX = "./tests/";

const tests = Object.fromEntries(
  Object.entries(import.meta.glob("./tests/**/*.js")).map(([k, v]) => [
    k.slice(PREFIX.length),
    v,
  ])
);

window.addEventListener("keydown", async (event) => {
  /* Unit tests */
  if (event.code === "KeyU" && event.shiftKey) {
    const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
    if (path) {
      localStorage.setItem(STORAGE_KEY, path);

      const load = tests[path];
      const loaded = await load();
      const test = loaded.default;
      await test();
    }
  }
  /* Batch tests */
  if (event.code === "KeyT" && event.shiftKey) {
    //TODO
  }
});

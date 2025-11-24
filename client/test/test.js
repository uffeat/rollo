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

const tests = (() => {
  const START = "./tests".length;
  return Object.fromEntries(
    Object.entries(import.meta.glob("./tests/**/*.js")).map(([k, v]) => [
      k.slice(START),
      v,
    ])
  );
})();

(() => {
  const KEY = "__test__";

  window.addEventListener("keydown", async (event) => {
    /* Unit tests */
    if (event.code === "KeyU" && event.shiftKey) {
      const path = prompt("Path:", localStorage.getItem(KEY) || "");
      if (path) {
        localStorage.setItem(KEY, path);
        const load = tests[path];
        const loaded = await load();
        const test = loaded.default;
        await test();
      }
    }
  });
})();

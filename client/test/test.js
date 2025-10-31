/* Testbench.
http://localhost:5173/test/test.html

NOTE 
- Test scripts can access to unbuilt as well as built 
parcels.

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

const { component } = await use("@/component.js");
const container = component.div({ parent: document.body });

await use("/test/foo.css", { as: "link" });

container.insert.beforeend(await use("/test/foo.template"));

console.log("foo:", (await use("/test/foo.js")).foo);
console.log("foo:", (await use("/test/foo.json")).foo);

await use("/test/ding.js", { as: "script" });
console.log("ding:", ding);

console.log("dong:", await use("/test/dong.js", { as: "iife" }));

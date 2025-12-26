/* Initialize import engine and load main sheet */
import "../../../client/src/main.css";
import "../use";
/* Load local sheet */
import "./test.css";
/* Overload to use live parcel */
import * as parcel from "../index";
use.add("@/rollo/rollo.js", parcel);

const { type } = await use("@/rollo/");
console.log(type(42));
console.log(type(null));
console.log(type(undefined));
console.log(type({foo: 42}));
console.log(type(new Proxy({}, {})));
console.log(type(() => 42));
class MyClass {
  static __type__ = "MyClass";
}
const myInstance = new MyClass();
console.log(type(myInstance));

console.log(myInstance.constructor.name);



document.documentElement.dataset.bsTheme = "dark";

/* Returns function that runs test from path */
const run = (() => {
  const START = "./tests".length;
  const loaders = Object.fromEntries(
    Object.entries({
      ...import.meta.glob("./tests/**/*.test.js"),
      ...import.meta.glob("./tests/**/*.x.html", {
        import: "default",
        query: "?raw",
      }),
    }).map(([k, v]) => {
      return [k.slice(START), v];
    })
  );

  use.sources.add("tests", async ({ path }) => {
    if (!(path.path in loaders)) {
      throw new Error(`Invalid path:${path.full}`);
    }
    return await loaders[path.path]();
  });

  return async (path) => {
    const asset = await use(`tests${path}`);
    await asset.default();
  };
})();

/* Trigger test from shortcut */
(() => {
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
      };
    })()
  );
})();

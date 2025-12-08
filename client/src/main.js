/* Initialize import engine */
import "@/use.js";
/* Activate Tailwind */
import "@/main.css";
/* Load Bootstrap sheet */
import "@/bootstrap/bootstrap.css";

import { layout } from "@/layout/layout.js";
import { component } from "@/component/component.js";

const fooHtml = await use(`/test/foo.template`);
console.log("fooHtml:", fooHtml);

const fooSheet = await use(`/test/foo.css`, { as: "sheet" });
console.log("fooSheet:", fooSheet);
fooSheet.use();

layout.insert.afterbegin(fooHtml);

const button = component.button(
  "btn.btn-primary",
  { parent: layout },
  "Button"
);

if (import.meta.env.DEV) {
  /* Add 'tests' source to import engine */
  await (async () => {
    const START = "../test/tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("../test/tests/**/*.test.js"),
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
  })();

  /* Runs test. */
  const run = async (path) => {
    const asset = await use(`tests${path}`);
    await asset.default();
  };

  /* Add test control */
  await (async () => {
    const KEY = "__test__";

    window.addEventListener(
      "keydown",
      (() => {
        layout.clear();

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
}

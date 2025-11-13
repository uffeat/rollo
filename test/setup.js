const STORAGE_KEY = "__test__";

/* Returns async function that sets up testbench. */
export const setup = ({ prefix = "./tests/", report } = {}) => {
  return async (loaders, target) => {
    const Module = await use("Module");
    const { Sheet } = await use("@/sheet.js");
    const { component } = await use("@/component.js");

    const Tests = new (class Tests {
      #_ = {};

      constructor() {
        this.#_.tests = Object.fromEntries(
          Object.entries(loaders).map(([k, v]) => [k.slice(prefix.length), v])
        );
      }

      get tests() {
        return this.#_.tests;
      }

      batch() {
        // TODO
      }

      async run(key) {
        const load = this.tests[key];
        const loaded = await load();

        let test = loaded.default;
        if (key.endsWith(".html")) {
          const temp = component.div({ innerHTML: test });
          const assets = {};
          temp.querySelectorAll("style[name]").forEach((e) => {
            assets[e.getAttribute("name")] = Sheet.create(e.textContent.trim());
          });
          temp.querySelectorAll("template[name]").forEach((e) => {
            assets[e.getAttribute("name")] = e.innerHTML.trim();
          });
          test = async (target, tests) =>
            (
              await Module.create(temp.find("script").textContent.trim(), key)
            ).default(target, assets, tests);
        }
        /* Run test and report */
        const result = await test(target, this);
        if (result !== undefined) {
          if (report) {
            report({ key, result });
          }
        }
      }
    })();

    window.addEventListener("keydown", async (event) => {
      /* Unit tests */
      if (event.code === "KeyU" && event.shiftKey) {
        const path = prompt("Path:", localStorage.getItem(STORAGE_KEY) || "");
        if (path) {
          localStorage.setItem(STORAGE_KEY, path);

          await Tests.run(path);
        }
      }
      /* Batch tests */
      if (event.code === "KeyT" && event.shiftKey) {
        Tests.batch();
      }
    });
  };
};

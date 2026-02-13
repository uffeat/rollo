const STORAGE_KEY = "__test__";

/* Returns async function that sets up testbench.
NOTE Returns function, so that caller can overload assets between import and setup. */
export const setup = () => {
  return async ({ prefix = "./tests/", report, tests }, tools = {}) => {
    const Module = await use("Module");
    const { Sheet } = await use("@/sheet.js");
    const { component } = await use("@/component.js");

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
          await run(path, load);
        }
      }
      /* Batch tests */
      if (event.code === "KeyT" && event.shiftKey) {
        for (const [key, load] of Object.entries(tests)) {
          if (key.includes(".batch.") || key.includes("batch/")) {
            const path = key.slice(prefix.length);
            await run(path, load);
          }
        }
      }
    });

    async function run(path, load) {
      const loaded = await load();
      let test = loaded.default;
      if (path.endsWith(".html")) {
        const temp = component.div({ innerHTML: test });
        const assets = {};
        temp.querySelectorAll("style[name]").forEach((e) => {
          assets[e.getAttribute("name")] = Sheet.create(e.textContent.trim());
        });
        temp.querySelectorAll("template[name]").forEach((e) => {
          assets[e.getAttribute("name")] = e.innerHTML.trim();
        });
        test = async (tools, tests) =>
          (
            await Module.create(temp.find("script").textContent.trim(), path)
          ).default(tools, assets, tests);
      }
      /* Run test and report */
      const result = await test(tools, tests);
      if (result !== undefined) {
        if (report) {
          await report({ path, result, test }, tools);
        }
      }
    }
  };
};

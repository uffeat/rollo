/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";
import router from "./router/router.js";

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");

if (import.meta.env.DEV) {
  /* NOTE Rules in "/dev.css" should eventually be transferred to 
  "/client/assets/main.css" from where build tools will minify etc. */
  await use("/dev.css");

  const parcels = Object.fromEntries(
    Object.entries({
      ...import.meta.glob("../../parcels/*/index.js"),
    })
      .map(([path, load]) => {
        return [path.slice(14, -9), load];
      })
      .filter(([path, load]) => !path.startsWith("_"))
  );

  /* Add 'tests' source to import engine */
  await (async () => {
    const { Exception } = await use("@/tools/exception");
    const START = "../test/tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("../test/tests/**/*.test.js"),
      }).map(([k, v]) => {
        return [k.slice(START), v];
      })
    );
    use.sources.add("tests", async ({ path }) => {
      Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
      return await loaders[path.path]();
    });
  })();

  /* Runs test. */
  const run = async (path) => {
    const asset = await use(`tests${path}`);
    await asset.default(parcels);
  };

  /* Add test control */
  await (async () => {
    const { layout } = await use("@/layout/");

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
          if (event.code === "KeyC" && event.shiftKey) {
            layout.clear();
            document.adoptedStyleSheets = [];
            history.replaceState({}, "", "/");
          }
        };
      })()
    );
  })();
} else {
await router();
}



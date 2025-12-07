if (import.meta.env.DEV) {
  /* NOTE Rules in "/dev.css" should eventually be transferred to 
  "/client/assets/main.css" from where build tools will minify etc. */

  console.log('HERE')



  await use("/dev.css");




  const parcels = Object.fromEntries(
    Object.entries({
      ...import.meta.glob("../../parcels/*/index.js"),
    }).map(([path, load]) => {
      return [path.slice(14, -9), load];
    })
  );

  //console.log("parcels:", parcels);////
  for (const [name, load] of Object.entries(parcels)) {

    console.log('name:', name)
    

    const parcel = await load()

    console.log('parcel:', parcel)
    
  }


  

  /* Add 'tests' source to import engine */
  await (async () => {
    const { Exception } = await use("@/tools/exception.js");
    const START = "./tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("./tests/**/*.test.js"),
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

    const BASE = "/test/test.html";
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
          if (event.code === "KeyC" && event.shiftKey) {
            layout.clear();
            document.adoptedStyleSheets = [];
            history.pushState({}, "", BASE);
          }
        };
      })()
    );
  })();
}

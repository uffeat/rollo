import "./use/use.js";

const Exception = await use("Exception");

if (import.meta.env) {
  const START = "./assets".length;

  const assets = Object.freeze(
    Object.fromEntries(
      Object.entries({
        ...import.meta.glob("./assets/**/*.html", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("./assets/**/*.js"),
        ...import.meta.glob("./assets/**/*.json", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("./assets/**/*.jsx"),
      }).map(([k, v]) => [k.slice(START), v])
    )
  );

  //console.log("assets:", assets);////

  use.sources.add("@@", async ({ options, owner, path }, ...args) => {
    Exception.if(!(path.path in assets), `Invalid path: @@${path.path}`);
    if (path.type === "js") {
      /* Escape transformation and processing */
      Object.assign(path.detail, { transform: false, process: false });
    }
    const load = assets[path.path];
    const result = await load();
    return result;
  });
}

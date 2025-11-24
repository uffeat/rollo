const { Exception } = await use("@/tools/exception.js");

const START = "./assets".length;

const loaders = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("./assets/**/*.css", {
      import: "default",
      query: "?raw",
    }),
    ...import.meta.glob("./assets/**/*.html", {
      import: "default",
      query: "?raw",
    }),
    ...import.meta.glob("./assets/**/*.json", {
      import: "default",
      query: "?raw",
    }),
  }).map(([k, load]) => {
    const path = `${k.slice(START)}`;
    return [path, load];
  })
);

use.sources.add("assets", async ({ path }) => {
  Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
  return await loaders[path.path]();
});

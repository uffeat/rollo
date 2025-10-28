/* TODO
- Implement shift+etc test bench; checkout 'setup'
*/

/* NOTE ...pretty unique, this module has access to unbuilt as well as built 
parcels and can therefore instigate tests based on either!
*/


import "../src/main.js";

const Path = await use("/path.js")
console.log("Path:", Path);


/* Parcels: Unbuilt parcels exports (index.js) and unbuilt parcel assets (/assets) */
const parcels = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("../../parcels/**/assets/**/*.css", {
      eager: true,
      import: "default",
      query: "?raw",
    }),
    ...import.meta.glob("../../parcels/**/assets/**/*.html", {
      eager: true,
      import: "default",
      query: "?raw",
    }),
    ...import.meta.glob("../../parcels/**/index.js"),
    ...import.meta.glob("../../parcels/**/assets/**/*.json", {
      eager: true,
      import: "default",
      //query: "?raw",
    }),
    ...import.meta.glob("../../parcels/**/assets/**/*.svg", {
      eager: true,
      import: "default",
      query: "?raw",
    }),
  }).map(([k, v], i, src) => {
    /* Adjust key */
    const path = Path.create(k.slice("../../parcels".length));
    const name = path.parts[0];

    if (path.type === "js") {
      const hasAssets = !!Object.keys(Object.fromEntries(src))
        .filter((part) => part.includes(`/${name}/assets/`))
        .at(0);

      if (hasAssets) {
        return [`/${name}/${name}.js`, v];
      }
      return [`/${name}.js`, v];
    }
    /* None-JS asset (from parcel 'assets') */
    return [`/${name}/${path.file}`, v];
  })
);

console.log("parcels:", parcels);











/*
component.h1({ parent: document.body, text: "I'm a component" });

await use("/test/bar.css", document.head);
document.body.insertAdjacentText("afterbegin", (await use("/test/foo.js")).foo);
document.body.insertAdjacentHTML("afterbegin", await use("/test/foo.html"));
document.body.insertAdjacentText(
  "afterbegin",
  (await use("/test/foo.json")).foo
);

await use("/test/foo.css", document);

console.log("meta:", use.meta);
console.log("Sheet:", await use("/sheet.js"));
*/
/* 
/dev.test.js
*/

const { iworker } = await use("@/iworker/");

use.sources.add("@@", async ({ options, owner, path }, ...args) => {
  //console.log("path:", path);////
  console.log("specifier:", path.specifier);////
  console.log("options:", options);////
  console.log("args:", args);

  const result = await iworker.request(path.specifier, options, ...args);

  return result;
});

await (async () => {
  const result = await use("@@/echo/", { test: true }, { foo: 42 }, 1, 2, 3);
  console.log("@@/echo/ result:", result); ////
})();

await (async () => {
  const result = await use("@@/echo:ping");
  console.log("@@/echo:ping result:", result); ////
})();

export default async () => {
  iworker
    .request(
      "@@/echo/",
      {},
      { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    )
    .then((result) => {
      //console.log("@@/echo/ result:", result); ////
    });

  iworker.request("@@/echo:ping").then((result) => {
    //console.log("@@/echo:ping result:", result); ////
  });
};

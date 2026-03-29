/* 
/dev.test.js
*/

const { iworker } = await use("@/iworker/");

use.sources.add("@@", async ({ options, owner, path }, ...args) => {
  //console.log("path:", path);////
  //console.log("specifier:", path.specifier); ////
  //console.log("options:", options); ////
  //console.log("args:", args);
  if (options.visible) {
    return await iworker.show(path.specifier, options, ...args);
  }
  return await iworker.request(path.specifier, options, ...args);
});

use.sources.add("rpc", async ({ options, owner, path }, ...args) => {
  return await iworker.request(path.specifier, options, ...args);
});

use.sources.add("api", async ({ options, owner, path }, ...args) => {
  return await iworker.request(path.specifier, options, ...args);
});

export default async () => {
  await (async () => {
    const result = await use("@@/echo/", { foo: 42 }, 1, 2, 3);
    console.log("@@/echo/ result:", result); ////
  })();

  await (async () => {
    const result = await use("rpc/echo/", {}, { foo: 42 }, 1, 2, 3);
    console.log("rpc/echo/ result:", result); ////
  })();

  await (async () => {
    const result = await use("api/echo/", {}, { foo: 42 }, 1, 2, 3);
    console.log("api/echo/ result:", result); ////
  })();

  

  await (async () => {
    const result = await use("@@/foo/", { visible: true });
    console.log("@@/foo/ result:", result); ////
  })();

  await (async () => {
    const result = await use("@@/stuff/", { visible: "popover" });
    console.log("@@/foo/ result:", result); ////
  })();
};

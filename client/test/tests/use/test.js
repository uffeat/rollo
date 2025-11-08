/*
use/test.js
*/

const Path = await use("Path");

export default async () => {
  await (async () => {
    console.log("foo:", (await use("/test/foo.js")).foo);
    console.log("foo:", (await use("/test/foo.json")).foo);
  })();

  await (async () => {
    console.log("foo:", (await use("@/test/foo.js")).foo);
    console.log("foo:", (await use("@/test/foo.json")).foo);
  })();

  await (async () => {
    console.log("foo:", (await use("@@/test/foo.js")).foo); ////
    console.log("foo:", (await use("@@/test/foo.json")).foo); ////
  })();
};

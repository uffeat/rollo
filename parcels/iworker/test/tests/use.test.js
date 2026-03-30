/* 
/use.test.js
*/

await use("@/iworker/");

export default async () => {
  await (async () => {
    const result = await use("@@/echo/", {}, { foo: 42 }, 1, 2, 3);
    console.log("@@/echo/ result:", result); ////
  })();

  // NOTE '.py' is required, when using the ':' syntax!
  await (async () => {
    const result = await use("@@/echo:ping.py");
    console.log("@@/echo:ping result:", result);
  })();

  await (async () => {
    const result = await use("rpc/echo/", {}, { foo: 42 }, 1, 2, 3);
    console.log("rpc/echo/ result:", result);
  })();

  await (async () => {
    const result = await use("@@/login/", { visible: "popover" });
    console.log("@@/login/ result:", result);
  })();

  await (async () => {
    const result = await use("api/echo/", {}, { foo: 42 }, 1, 2, 3);
    console.log("api/echo/ result:", result);
  })();

  await (async () => {
    const result = await use("@@/foo/", { visible: true });
    console.log("@@/foo/ result:", result);
  })();

  await (async () => {
    const result = await use("@@/stuff/", { visible: "popover" });
    console.log("@@/foo/ result:", result);
  })();
};

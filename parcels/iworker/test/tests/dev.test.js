/* 
/dev.test.js
*/

const { iworker } = await use("@/iworker/");


export default async () => {
  await (async () => {
    const result = await use("@@/echo.py/", {}, { foo: 42 }, 1, 2, 3);
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

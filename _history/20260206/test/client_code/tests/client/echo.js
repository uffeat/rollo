/*
client/echo.js
*/

export default async () => {
  await (async () => {
    const echo = await use("@@/echo/");
    const result = await echo({ foo: 42 }, 1, 2, 3);
    console.log("result:", result);
  })();

  await (async () => {
    const echo = await use("@@/echo/", { response: false });
    const result = await echo({ foo: 42 }, 1, 2, 3);
    console.log("result:", result);
  })();

  await (async () => {
    const ping = await use("@@/echo:ping");
    const result = await ping();
    console.log("result:", result);
  })();

};

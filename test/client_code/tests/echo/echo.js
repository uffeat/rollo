/*
echo/echo.js
*/

export default async () => {
 

  await (async () => {
    const echo = await use("@@/echo/");
    const result = echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const echo = (await use("@/echo")).echo;
    const result = echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const echo = (await use("/echo")).echo;
    const result = echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const echo = (await use("assets/echo.js")).echo;
    const result = echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const echo = await use("rpc/echo", { spinner: true });
    const response = await echo(42);
    const result = response.result;
    console.log("result:", result);
  })();

  await (async () => {
    const { server } = await use("@/server");
    const response = await server.echo(42);
    //const result = response.result;
    //console.log("result:", result);
  })();
};

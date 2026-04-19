/*
packages/echo/echo.js
*/

export default async () => {
  

  await (async () => {
    const echo = await use("@@/echo/", { test: true });
    const result = echo(42);
    console.log("result:", result);
  })();

  
};



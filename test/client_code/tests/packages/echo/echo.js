/*
packages/echo/echo.js
*/

export default async () => {
  console.clear();

  await (async () => {
    const echo = await use("@@/echo/", { test: true });
    const result = echo(42);
    console.log("result:", result);
  })();

  // Alt
  await (async () => {
    const echo = await use.packages("@@/echo/", true);

    console.log("echo:", echo);
    console.dir(echo);
    const unwrapped = echo.unwrap();
    console.log("unwrapped:", unwrapped);

    const result = echo({ foo: 42 }, 1, 2, 3);
    console.log("result:", result);
  })();
};



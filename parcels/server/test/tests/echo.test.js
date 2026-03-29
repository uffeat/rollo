/* 
/echo.test.js
*/

const { server } = await use("@/server");

export default async () => {
  const { result, meta } = await server.echo(
    // query:
    { test: true },
    // kwargs:
    { foo: "FOO", things: [{ a: 1 }, { b: 2 }], random: crypto.randomUUID() },
    // args:
    { first: "FIRST" },
    10,
    20,
    30,
    { last: "LAST" },
  );
  console.log("result:", result);
  console.log("meta:", meta);
};

/* 
/echo.test.js
*/

const { Server, server } = await use("@/server");

export default async () => {
  // Using 'server'
  await (async () => {
    const echo = server.echo({ test: true, foo: 42 });
    const { result, meta } = await echo(
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
  })();
  // Using 'use'
  await (async () => {
    const echo = await use("server/echo", { test: true, foo: 42 });
    const { result, meta } = await echo(
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
  })();
  // Using 'Server'
  await (async () => {
    const echo = Server.call("echo")({ test: true, foo: 42 });
    const { result, meta } = await echo(
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
  })();
};

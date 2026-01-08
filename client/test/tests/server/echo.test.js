/*
/server/echo.test.js
*/
import { server } from "@/server";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });

  await (async () => {
    const result = await server.echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await server.echo(43);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await server.foo();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await server.bar({ bar: "BAR" });
    console.log("result:", result);
  })();
};

/*
/anvil/basics.test.js
*/

import { anvil } from "@/anvil";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  await (async () => {
    const result = await anvil.echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await anvil.echo("foo");
    console.log("result:", result);
  })();
};

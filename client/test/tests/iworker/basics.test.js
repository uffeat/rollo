/*
/iworker/basics.test.js
*/

import { iworker } from "@/iworker";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  await (async () => {
    const result = await iworker.echo(42);
    console.log("result:", result);
  })();

  await (async () => {
    const result = await iworker.echo("foo");
    console.log("result:", result);
  })();
};

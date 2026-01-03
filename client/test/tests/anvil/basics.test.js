/*
/anvil/basics.test.js
*/

import { Anvil } from "@/anvil";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const { anvil, request } = await Anvil("https://rollohdev.anvil.app");

  anvil.echo(42).then((data) => {
    console.log("data:", data);
  });

 
};

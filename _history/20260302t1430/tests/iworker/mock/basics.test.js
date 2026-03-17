/*
/anvil/mock/basics.test.js

NOTE Run `test/anvilsim` to enable this test.
*/

import { Anvil } from "@/anvil";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const { anvil, request } = await Anvil("http://localhost:8069");

  anvil.echo(42).then((data) => {
    console.log("data:", data);
  });

 
  request("echo", 42).then((data) => {
    console.log("data:", data);
  });

  anvil.echo("foo").then((data) => {
    console.log("data:", data);
  });

  anvil.echo(43).then((data) => {
    console.log("data:", data);
  });

  try {
    await anvil.bad();
  } catch (error) {
    console.log("Error as expected.");
  }

  try {
    await Anvil("XXXhttp://localhost:8069");
  } catch (error) {
    console.log("Error as expected.");
  }

  await (async () => {
    const { anvil, request } = await Anvil("http://localhost:8069");

    const result = await anvil.echo("bar");
    console.log("result:", result);
  })();
};

/*
/anvil/receivers.test.js
*/

import { anvil } from "@/anvil";
import text from "./scripts/parent.py?raw";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  anvil.receivers.effects.add("main", (data) => {
    console.log("data:", data);
  });

  await anvil.run({ text });
};

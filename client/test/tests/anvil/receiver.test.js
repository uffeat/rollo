/*
/anvil/receiver.test.js
*/

import { anvil } from "@/anvil";
import text from "./scripts/parent.py?raw";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  anvil.receiver.effects.add((change) => {
    console.log("change:", change);
  });

  await anvil.run({ text });
};

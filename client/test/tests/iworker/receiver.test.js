/*
/iworker/receiver.test.js
*/

import { iworker } from "@/iworker";
import text from "./scripts/parent.py?raw";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  iworker.receiver.effects.add((change) => {
    console.log("change:", change);
  });

  await iworker.run({ text });
};

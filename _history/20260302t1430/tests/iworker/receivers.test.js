/*
/iworker/receivers.test.js
*/

import { iworker } from "@/iworker";
import text from "./scripts/parent.py?raw";

const { component, app } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  iworker.receivers.effects.add("main", (data) => {
    console.log("data:", data);
  });

  await iworker.run({ text });
};

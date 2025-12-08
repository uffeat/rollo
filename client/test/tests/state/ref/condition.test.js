/*
/state/ref/condition.test.js
*/

import "@/use.js";
import { ref } from "@/state/state.js";

export default async () => {
  (() => {
    const state = ref(42);

    state.effects.add(
      (current, message) => {
        console.log("current:", current);
      },
      (current, message) => {
        return typeof current === "number";
      }
    );

    state(43);
    state(43);
    state("foo");
  })();
};

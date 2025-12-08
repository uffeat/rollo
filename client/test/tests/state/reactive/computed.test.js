/*
/state/reactive/computed.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { reactive } from "@/state/state.js";

export default async () => {
  layout.clear(":not([slot])");

  const state = reactive({ foo: 2, bar: 4 });

  const group = component.div(
    "input-group.container.my-3",
    {
      parent: layout,
    },
    function () {
      const button = component.button("btn.btn-primary", {
        parent: this,
        text: "Change state",
      });

      button.on.click = (event) => {
        state.map(([k, v]) => [k, Math.floor(Math.random() * 11)]);
        console.log("state:", state().current);
      };
    }
  );
  const input = component.input("form-control", {
    parent: group,
    readOnly: true,
    type: "number",
    title: "Computed",
    textAlign: "center",
  });

  const computed = state().computed.add(
    /* Reducer */
    (change, message) => {
      const data = message.detail.data;
      for (const value of Object.values(change)) {
        data.result += value;
      }
      return data.result;
    },
    /* Options -> provide data to store result */
    { data: { result: 0 } },
    /* Effect -> show computed */
    (current, message) => {
      input.value = current;
    }
  );
};

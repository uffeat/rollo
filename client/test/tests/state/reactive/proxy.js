/*
state/reactive/proxy.js
*/

import { reactive } from "../../../../../parcels/state/index.js";

const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const state = reactive(
    { foo: 42 },
    { detail: { count: 0 } },
    (change, message) => {
      console.log("message:", message);



      const data = message.detail.data;
      if (!('count' in data)) {
        data.count = 0
      }
      data.count++


      //console.log('message.owner:', message.owner)
      message.owner.detail.count++;

      console.log("change:", change);

      console.log("session:", message.owner.session);

      console.log("detail.count:", message.owner.detail.count);
      console.log("data.count:", data.count);
    }
  );

  //console.log('state:', state)
  //console.log('state.current:', state.current)
  state({ bar: "BAR", ding: true, foo: 42 });
  state.foo = 42
  state.foo++
  console.log("state._:", state._);
};

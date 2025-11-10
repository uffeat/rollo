/*
state/reactive/foreach.js
*/

import { reactive } from "../../../../../parcels/state/index.js";

const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const state = reactive({ foo: 2, bar: 3 });

  state.forEach(([k, v]) => console.log(`${k}:`, v))


  


};

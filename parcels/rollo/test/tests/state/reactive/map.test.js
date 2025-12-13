/*
/state/reactive/map.test.js
*/


import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { reactive } from "@/state/state.js";

export default async () => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing map method'})

  const state = reactive({ foo: 2, bar: 3 }, (change, message) => {
    console.log("change:", change);
  });

  state.map(([k, v]) => [k, 2*v])

  state.ding = 42

  console.log("Has ding:", 'ding' in state);


  


};

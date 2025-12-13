/*
/state/reactive/foreach.test.js
*/


import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { reactive } from "@/state/state.js";


export default async () => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing forEach method'})

  const state = reactive({ foo: 2, bar: 3 });

  state.forEach(([k, v]) => console.log(`${k}:`, v))


  


};

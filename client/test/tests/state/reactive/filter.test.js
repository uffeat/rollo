/*
/state/reactive/filter.test.js
*/
import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { reactive } from "@/state/state.js";


export default async () => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing filter method'})

  const state = reactive({ foo: 42, bar: "BAR" }, (change, message) => {
    console.log("change:", change);
  });

  state.filter(([k, v]) => typeof v === "number");
};

/*
/tools/future.test.js
*/

import "@/use.js";
import {
  Future,
} from "@/tools/future.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");

  const future = Future.create((value) => console.log(`Callback got value:`, value))

  const button = component.button("btn.btn-primary", {parent: layout}, 'Resolve')
  button.on.click = (event) => future.resolve(true)

  await future.promise

  console.log(`Resolved`)
 
};
/*
/tools/future.test.js
*/

import "@/use";
import {
  Future,
} from "@/tools/future";
import { layout } from "@/layout/layout";

const { component } = await use("@/rollo");

export default async () => {
  layout.clear(":not([slot])");

  const future = Future.create((value) => console.log(`Callback got value:`, value))

  const button = component.button("btn.btn-primary", {parent: layout}, 'Resolve')
  button.on.click = (event) => future.resolve(true)

  await future.promise

  console.log(`Resolved`)
 
};
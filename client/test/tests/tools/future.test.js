/*
/tools/future.test.js
*/

import {
  Future,
} from "../../../../assets/tools/future.js";

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const future = Future.create((value) => console.log(`Callback got value:`, value))

  const button = component.button("btn.btn-primary", {parent: layout}, 'Resolve')
  button.on.click = (event) => future.resolve(true)

  await future.promise

  console.log(`Resolved`)
 
};
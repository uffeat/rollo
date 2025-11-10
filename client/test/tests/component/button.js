/*
component/button.js
*/

import { component } from "../../../../parcels/component/index.js";
//const { component } = await use("@/component.js");

const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });
};

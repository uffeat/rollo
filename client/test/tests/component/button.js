/*
component/button.js
*/

import * as parcel from "../../../../parcels/component/index.js";
use.assets.add("@/component.js", parcel);

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });
};

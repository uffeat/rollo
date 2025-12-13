/*
/component/button.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });
};

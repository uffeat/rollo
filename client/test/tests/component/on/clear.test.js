/*
/component/on/clear.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });

  button.on.click((event) => console.log("Clicked"), { track: true });

  console.log("Size before clear:", button.on.registry.size("click"));

  button.on.registry.clear("click");

  console.log("Size after clear:", button.on.registry.size("click"));
};

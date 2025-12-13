/*
/component/classes/clear.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button(
    "text-3xl text-red-300 font-bold",
    {
      text: "Reset style",
      parent: layout,
    }
  );

  button.on.click(function (event) {
    this.classes.clear();

    console.log("button:", this);
  });
};

/*
/component/classes/remove.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button(
    "text-3xl text-red-300 font-bold",
    {
      text: "Remove bold",
      parent: layout,
    }
  );

  button.on.click(function (event) {
    this.classes.remove('font-bold');

    console.log("button:", this);
  });
};

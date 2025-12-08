/*
/component/classes/basics.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  component.button(".btn", {
    text: "Button",
    parent: layout,
    '. btn-success': true


  });

  const button = component.button("bg-sky-500/80 rounded", {
    text: "Button",
    parent: layout,

  });

  button.classes.add("text-red-300 p-4 foo bar hover:text-green-300");

  button.class["font-bold hover:bg-sky-700"];
  button.class["hover:text-green-300"] = 0;

  console.log("button:", button);
};

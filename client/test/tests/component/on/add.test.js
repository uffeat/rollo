/*
/component/on/add.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  /** Different ways to register */

  /* Inside update */
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
    "on.click": (event) => console.log("Clicked 1"),
  });

  /* Getter-style */
  button.on.click((event) => console.log("Clicked 2"));

  /* Setter-style */
  button.on.click = (event) => console.log("Clicked 3");

  /* Apply-style */
  button.on({ click: (event) => console.log("Clicked 4") });

  /* Modified classic */
  button.addEventListener({
    click: (event) => {
      console.log("Clicked 5");
    },
  });

  /* Explicit getter/apply-style */
  button.on.click.use((event) => console.log("Clicked 6"));
};

/* 
/layout/buttons.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default () => {
  layout.clear(":not([slot])");
  
  component.menu(
    {
      parent: layout,
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      padding: "0.5rem",
      "on.click": (event) => layout.clear(),
    },
    component.button("btn.btn-success", { text: "Button" }),
    component.button("btn.btn-success", { text: "Button" })
  );
};

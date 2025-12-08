/*
/component/hook.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";


export default async () => {
  layout.clear(":not([slot])");

  const button = component
    .button("btn.btn-success", {
      text: "Button",
      parent: layout,
    })
    .hook(function () {
      this.on.click = (event) => {
        console.log("Clicked");
      };
    });

    console.log("Button:", button);

  
};

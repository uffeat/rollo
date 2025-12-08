/*
/component/on/remove.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  /** Different ways to deregister */

  /* With 'remove' function */
  (() => {
    const button = component.button("btn.btn-success", {
      text: "Button",
      parent: layout,
    });
    const { remove } = button.on.click.use({ track: true }, (event) =>
      console.log("Clicked")
    );
    console.log("Size before remove:", button.on.registry.size("click"));
    remove();
    console.log("Size after remove:", button.on.registry.size("click"));
  })();


  /* With 'unuse' option */
  (() => {
    const button = component.button("btn.btn-primary", {
      text: "Button",
      parent: layout,
    });
    const handler = (event) => console.log("Clicked");
    button.on.click({ track: true }, handler);
    console.log("Size before remove:", button.on.registry.size("click"));
    button.on.click.unuse({ track: true }, handler);
    console.log("Size after remove:", button.on.registry.size("click"));
  })();


  /* Modified classic */
  (() => {
    const button = component.button("btn.btn-secondary", {
      text: "Button",
      parent: layout,
    });
    const { handler, track } = button.on.click({ track: true }, (event) =>
      console.log("Clicked")
    );
    console.log("Size before remove:", button.on.registry.size("click"));
    button.removeEventListener({ click: handler }, { track });
    console.log("Size after remove:", button.on.registry.size("click"));
  })();
};

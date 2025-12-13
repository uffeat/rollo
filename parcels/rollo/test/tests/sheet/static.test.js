/*
/sheet/static.test.js
*/


import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, rule, scope } from "@/sheet/sheet.js";

import { sheets } from "./sheets.js";

export default () => {
  layout.clear(":not([slot])");

  const sheet = Sheet.create(sheets.base, {}, { foo: 42 }).use(document);

  console.log("detail:", sheet.detail); ////

  component.menu(
    {
      parent: layout,
      "on.click": (event) => {
        if (event.target._action) {
          event.target._action();
        }
      },
    },
    component.button("base", {
      text: "Clear",
      _action: () => sheet.rules.clear(),
    }),
    component.button({
      text: "Unuse",
      _action: () => sheet.unuse(document),
    }),
    component.button(
      {
        text: "Remove",
      },
      function () {
        this._action = () => this.parent.remove();
      }
    )
  );
};

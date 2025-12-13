/*
/sheet/dynamic.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, rule, scope } from "@/sheet/sheet.js";

import { sheets } from "./sheets.js";

export default () => {
  layout.clear(":not([slot])");

  const path = "base";
  const sheet = Sheet.create(
    sheets[path],
    path,
    {
      ".base": css.backgroundColor.hotpink,
      min600: {
        ".base": css.backgroundColor.green,
      },
      slideIn: {
        0: {
          translate: css.vw(150),
          scale: 2,
        },
        100: {
          translate: 0,
          scale: 1,
        },
      },
    },
    { foo: 42 }
  ).use(document);

  console.log("detail:", sheet.detail); ////

  console.log("text:", sheet.rules.text); ////

  sheet.rules.update({
    ".base": {
      ...css.border["4px solid red"],
      animationName: "slideIn",
      animationDuration: css.s(1),
    },
    min600: {
      ".base": { fontSize: { px: 48 } },
    },
    slideIn: {
      0: {
        translate: css.vw(150),
        scale: 2,
      },
      100: {
        translate: 0,
        scale: 5,
      },
    },
  });

  sheet.rules.remove("button.base");

  console.log("text:", sheet.rules.text); ////

  component.button("base", {
    text: "Reset",
    parent: layout,
    "on.click": (event) => {
      event.target.remove();
      sheet.unuse(document);

      component.button("base", {
        text: "Remove",
        parent: layout,
        "on.click": (event) => {
          event.target.remove();
        },
      });
    },
  });
};

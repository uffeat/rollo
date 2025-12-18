/*
/sheet/dynamic.test.js
*/

import { sheets } from "./sheets.js";

const { component, Sheet, declare } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const path = "base";
  const sheet = Sheet.create(
    sheets[path],
    path,
    {
      ".base": declare.backgroundColor.hotpink,
      min600: {
        ".base": declare.backgroundColor.green,
      },
      slideIn: {
        0: {
          translate: declare.vw(150),
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
      ...declare.border["4px solid red"],
      animationName: "slideIn",
      animationDuration: declare.s(1),
    },
    min600: {
      ".base": { fontSize: { px: 48 } },
    },
    slideIn: {
      0: {
        translate: declare.vw(150),
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
    parent: frame,
    "on.click": (event) => {
      event.target.remove();
      sheet.unuse(document);

      component.button("base", {
        text: "Remove",
        parent: frame,
        "on.click": (event) => {
          event.target.remove();
        },
      });
    },
  });
};

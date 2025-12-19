/*
/sheet/dynamic.test.js
*/

import { sheets } from "./sheets.js";

const { component, Sheet, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const path = "base";
  const sheet = Sheet.create(
    sheets[path],
    path,
    {
      ".base": css.backgroundColor.hotpink,
      [css.media.min(css.px(600))]: {
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
    [css.media.min(css.px(600))]: {
      ".base": { fontSize: css.px(48) },
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

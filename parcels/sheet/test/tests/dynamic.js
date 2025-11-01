/*
dynamic.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default ({ Sheet, assets, css }) => {
  const path = "base";
  const sheet = Sheet.create(assets[path], path).use(document);

  sheet.rules.add({
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
  });

  console.log("text:", sheet.rules.text); ////

  sheet.rules.update({
    ".base": {
      ...css.border["4px solid red"],
      ...css.animationName.slideIn,
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
    "@click": (event) => {
      event.target.remove();
      sheet.unuse(document);

      component.button("base", {
        text: "Remove",
        parent: layout,
        "@click": (event) => {
          event.target.remove();
        },
      });
    },
  });
};

/*
/app/breakpoints/basics.test.js
*/

const { app, css, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  const container = component.div(
    "container",
    {
      parent: frame,
      ...css.display.flex,
      ...css.flexDirection.column,
      ...css.alignItems.end,
      margin: `${css.rem(1)} auto`,
      border: "2px solid green",
    },
    component.h2({
      text: "XS",
      color: css.__.bsLight,
    })
  );

  const defaults = {
    parent: container,
  };

  [
    ["sm", css.__.bsRed],
    ["md", css.__.bsOrange],
    ["lg", css.__.bsYellow],
    ["xl", css.__.bsPurple],
    ["xxl", css.__.bsBlue],
  ].forEach(([breakpoint, color]) => {
    const element = component.h2("invisible", {
      text: breakpoint.toUpperCase(),
      color,
      ...defaults,
    });

    app.effects.add(
      (change, message) => element.classes.if(!change[breakpoint], "invisible"),
      [breakpoint]
    );
  });
};

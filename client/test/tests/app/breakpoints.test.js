/*
/app/breakpoints.test.js
*/

const { component, element, Sheet, css, app, breakpoints } = await use(
  "@/rollo/"
);
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  app.on._break_sm({ run: true }, (event) => {
    console.log("sm satisfied:", event.detail ?? app.$.sm);
  });

  app.effects.add(
    (change, message) => {
      //console.log("state:", app.state);
      const current = app.state.current;
    },
    ["sm", "md", "lg", "xl", "2xl"]
  );

  const container = component.div(
    "container",
    {
      parent: frame,

      ...css.display.flex,
      ...css.flexDirection.column,
      ...css.alignItems.end,
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
    ["2xl", css.__.bsBlue],
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

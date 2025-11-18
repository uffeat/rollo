/*
dsl.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default ({ Sheet, sheets, css, rule, scope }) => {
  layout.clear(":not([slot])");

  const sheet = Sheet.create().use(document);

  const element = component.div({ parent: layout }, component.p({}, "Hi!"));

  sheet.rules.add({
    [scope(element)]: {
      ...css.display.flex,
      width: css.rem(3),
      height: css.rem(4),
      backgroundColor: css.color.hex.ea2d2d,
      color: css.__.bsBlue,
      border: css(css.px(4), css.value.solid, css.value.green),
    },
  });

  //console.log("text:", sheet.rules.text); ////

  const r = rule()
    .h1.classes("foo")
    .attrs({ bar: true })
    .child("div")
    ._.h2({ color: "pink" });

  console.log("r:", r);
};

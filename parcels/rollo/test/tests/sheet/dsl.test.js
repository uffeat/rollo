/*
/sheet/dsl.test.js
*/

const { component, Sheet, declare, rule, scope } = await use("@/rollo/");
const { frame } = await use("@/frame/");



export default () => {
  frame.clear(":not([slot])");

  const sheet = Sheet.create().use(document);

  const element = component.div({ parent: frame }, component.p({}, "Hi!"));

  sheet.rules.add({
    [scope(element)]: {
      ...declare.display.flex,
      width: declare.rem(3),
      height: declare.rem(4),
      backgroundColor: declare.color.hex.ea2d2d,
      color: declare.__.bsBlue,
      border: declare(declare.px(4), declare.value.solid, declare.value.green),
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

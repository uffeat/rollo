/*
/sheet/dsl.test.js
*/

const { component, Sheet, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");



export default () => {
  frame.clear(":not([slot])");

  const sheet = Sheet.create().use(document);

  const element = component.div({ parent: frame }, component.p({}, "Hi!"));

  sheet.rules.add({
    [css(element)]: {
      ...css.display.flex,
      width: css.rem(3),
      height: css.rem(4),
      backgroundColor: css.color.hex.ea2d2d,
      color: css.__.bsBlue,
      border: css(css.px(4), 'solid', 'green'),
    },
  });

  //console.log("text:", sheet.rules.text); ////

  
};

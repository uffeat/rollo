/*
/sheet/invalid.test.js
*/

const { component, Sheet, declare } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const sheet = Sheet.create().use();

  try {
    sheet.rules.add({
      h1: { bad: "pink" },
    });
  } catch (error) {
    component.p(
      {
        parent: frame,
        text: `Error `,
        padding: declare.rem(1),
        ...declare.marginLeft.auto,
      },
      component.span({
        text: error.message,
        color: declare.__.bsDanger,
      })
    );
  }
};

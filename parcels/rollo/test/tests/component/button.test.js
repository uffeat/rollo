/*
/component/button.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
  });
};

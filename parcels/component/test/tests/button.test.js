/*
/button.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });
};

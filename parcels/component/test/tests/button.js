/*
button.js
*/
//const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ component }) => {
  layout.clear(":not([slot])");
  component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });
};

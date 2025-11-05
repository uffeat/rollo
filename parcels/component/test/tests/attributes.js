/*
attributes.js
*/
//const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ component }) => {
  layout.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });

  button.attribute.score = 0
};

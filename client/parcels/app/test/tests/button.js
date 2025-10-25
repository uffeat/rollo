/*
button.js
*/
const { component } = await use("/component.js");

export default async ({ app, layout }) => {
  layout.clear(":not([slot])");

  component.button("btn.btn-success", { text: "Button", parent: layout });
};

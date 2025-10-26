/*
button.js
*/
const { component } = await use("/component.js");

export default async ({ layout }) => {
  layout.clear(":not([slot])");

  component.button("btn.btn-success", { text: "Button", parent: layout });
};

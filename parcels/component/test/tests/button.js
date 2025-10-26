/*
button.js
*/

export default async ({ component, layout }) => {
  layout.clear(":not([slot])");
  component.button("btn.btn-success", { text: "Button", parent: layout });
};

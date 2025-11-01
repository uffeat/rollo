/*
button.js
*/

export default async ({ component }) => {
  component.button("btn.btn-success", {
    text: "Button",
    parent: document.body,
  });
};

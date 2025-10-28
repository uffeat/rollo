/*
component/button.js
*/

export default async () => {
  const { component } = await use("/component.js");

  component.button("btn.btn-success", {
    text: "Button",
    parent: document.body,
  });
};

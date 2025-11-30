/*
/on/clear.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });

  button.on.click((event) => console.log("Clicked"), { track: true });

  console.log("Size before clear:", button.on.registry.size("click"));

  button.on.registry.clear("click");

  console.log("Size after clear:", button.on.registry.size("click"));
};

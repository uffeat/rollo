/*
/component/on/clear.test.js
*/
const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
  });

  button.on.click((event) => console.log("Clicked"), { track: true });

  console.log("Size before clear:", button.on.registry.size("click"));

  button.on.registry.clear("click");

  console.log("Size after clear:", button.on.registry.size("click"));
};

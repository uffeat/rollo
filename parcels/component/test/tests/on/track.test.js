/*
/on/track.test.js
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



  button.on.click({ track: true }, (event) => console.log("Clicked"));
  button.on.click({ track: true }, (event) => console.log("Clicked"));

  console.log("Number of tracked click handlers:", button.on.registry.size("click"));

  console.log("Tracked types:", button.on.registry.types);
};

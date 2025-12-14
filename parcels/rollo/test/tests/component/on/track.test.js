/*
/component/on/track.test.js
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

  button.on.click({ track: true }, (event) => console.log("Clicked"));
  button.on.click({ track: true }, (event) => console.log("Clicked"));

  console.log(
    "Number of tracked click handlers:",
    button.on.registry.size("click")
  );

  console.log("Tracked types:", button.on.registry.types);
};

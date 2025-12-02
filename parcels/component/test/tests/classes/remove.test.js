/*
/classes/remove.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button(
    "text-3xl text-red-300 font-bold",
    {
      text: "Remove bold",
      parent: layout,
    }
  );

  button.on.click(function (event) {
    this.classes.remove('font-bold');

    console.log("button:", this);
  });
};

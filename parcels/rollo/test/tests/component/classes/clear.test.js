/*
/component/classes/clear.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  const button = component.button(
    "text-3xl text-red-300 font-bold",
    {
      text: "Reset style",
      parent: frame,
    }
  );

  button.on.click(function (event) {
    this.classes.clear();

    console.log("button:", this);
  });
};

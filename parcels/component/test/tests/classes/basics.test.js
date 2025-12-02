/*
/classes/basics.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  component.button(".btn", {
    text: "Button",
    parent: layout,
    '. btn-success': true


  });

  const button = component.button("bg-sky-500/80 rounded", {
    text: "Button",
    parent: layout,

  });

  button.classes.add("text-red-300 p-4 foo bar hover:text-green-300");

  button.class["font-bold hover:bg-sky-700"];
  button.class["hover:text-green-300"] = 0;

  console.log("button:", button);
};

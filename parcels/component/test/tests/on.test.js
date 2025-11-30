/*
/on.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  layout.close();

  /** 4 ways of using the special on syntax */

  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
    "on.click.once": (event) => {
      console.log("update-handler called");
    },
  });

  button.on.click({ once: true }, (event) =>
    console.log("getter-handler called")
  );

  button.on["click.once"] = (event) => {
    console.log("setter-handler called");
  };

  button.on("click", { once: true }, (event) => {
    console.log("apply-handler called");
  });





  console.log(typeof button.on)

 
};

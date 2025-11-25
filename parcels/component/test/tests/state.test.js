/*
/state.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });

  button.$.effects.add(
    (change) => {
      console.log("change:", change);
    },
    { run: false },
    ["data.bar"]
  );


  /** Ways to update reactively */

  /* ... single */
  button.$["data.bar"] = true;
  /* ... batch (equivalent methods) */
  button.$({ "data.bar": 42 });
  button.update({ "$data.bar": 'BAR' })

  console.log("button:", button);
};

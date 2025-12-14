/*
/component/on/add.test.js
*/


const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  frame.close();

  /** Different ways to register */

  /* Inside update */
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
    "on.click": (event) => console.log("Clicked 1"),
  });

  /* Getter-style */
  button.on.click((event) => console.log("Clicked 2"));

  /* Setter-style */
  button.on.click = (event) => console.log("Clicked 3");

  /* Apply-style */
  button.on({ click: (event) => console.log("Clicked 4") });

  /* Modified classic */
  button.addEventListener({
    click: (event) => {
      console.log("Clicked 5");
    },
  });

  /* Explicit getter/apply-style */
  button.on.click.use((event) => console.log("Clicked 6"));
};

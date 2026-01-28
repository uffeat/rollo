/* 
/buttons.test.js
*/

const { component } = await use("@/rollo/");


export default async () => {
  const { frame } = await use("@/frame/");
  frame.clear(":not([slot])");
  
  component.menu(
    {
      parent: frame,
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      padding: "0.5rem",
      "on.click": (event) => frame.clear(),
    },
    component.button("btn.btn-success", { text: "Button" }),
    component.button("btn.btn-success", { text: "Button" })
  );
};


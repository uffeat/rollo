/* 
/basics.test.js
*/

const { component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear(":not([slot])");

  const main = component.main("container", {
    parent: frame,
    width: css.px(1000),
    backgroundColor: "pink",
  });

  component.menu(
    {
      parent: main,
      width: css.pct(100),
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "0.5rem",
      padding: "0.5rem",
      "on.click": (event) => frame.clear(),
    },
    component.button("btn.btn-success", { text: "Button" }),
    component.button("btn.btn-success", { text: "Button" })
  );
};

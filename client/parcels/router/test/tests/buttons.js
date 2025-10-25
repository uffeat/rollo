/* 
buttons.js
*/
const { component } = await use("/component.js");

export default ({ layout }) => {
  component.menu(
    {
      parent: layout,
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      padding: "0.5rem",
      "@click": (event) => layout.clear(),
    },
    component.button("btn.btn-success", { text: "Button" }),
    component.button("btn.btn-success", { text: "Button" })
  );
};

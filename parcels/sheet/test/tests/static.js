/*
static.js
*/
const { component } = await use("@/component.js");

export default ({ Sheet, assets, css }) => {
  

  const sheet = Sheet.create(assets.base).use(document);
  
  component.menu(
    {
      parent: document.body,
      "@click": (event) => {
        if (event.target._action) {
          event.target._action();
        }
      },
    },
    component.button("base", {
      text: "Clear",
      _action: sheet.rules.clear,
    }),
    component.button({
      text: "Unuse",
      _action: () => sheet.unuse(document),
    }),
    component.button(
      {
        text: "Remove",
      },
      function () {
        this._action = () => this.parent.remove();
      }
    )
  );
};

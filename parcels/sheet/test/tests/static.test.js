/*
/static.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Sheet, css, rule, scope } = await use("@/sheet");

export default (parcel, sheets) => {
  layout.clear(":not([slot])");

  const sheet = Sheet.create(sheets.base, {}, { foo: 42 }).use(document);

  console.log("detail:", sheet.detail); ////

  component.menu(
    {
      parent: layout,
      "@click": (event) => {
        if (event.target._action) {
          event.target._action();
        }
      },
    },
    component.button("base", {
      text: "Clear",
      _action: () => sheet.rules.clear(),
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

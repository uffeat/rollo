/*
ref/count_sheet.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");

const sheet = Sheet.create();
sheet.rules.add({
  "ref-component": {
    fontWeight: css.important(700),
    margin: css.rem(1),
    ...css.marginLeft.auto,
  },

  "ref-component::after": {
    content: css.attr("current"),
    fontWeight: css.important("initial"),
  },
});

export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");
  const state = RefComponent(
    "btn.btn-primary",
    { current: 0, text: "Count: " },
    function () {
      /* Use/unuse sheet */
      this.on._connect$once = (event) => sheet.use();
      this.on._disconnect$once = (event) => sheet.unuse();
      /* Click -> update current */
      this.on.click = (event) => (this.current += 1);
      /* NOTE Add to parent after lifecycle setup */
      layout.append(this);
    }
  );
};

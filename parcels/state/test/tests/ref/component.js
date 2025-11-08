/*
ref/component.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");
const sheet = Sheet.create();

export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");
  sheet.rules.clear();

  const button = component.button("btn.btn-primary", 'Count: ', function () {
    /* Create rules */
    sheet.rules.add({
      [`[uid="${this.uid}"]`]: {
        fontWeight: css.important(700),
        margin: css.rem(1),
        ...css.marginLeft.auto,
      },

      [`[uid="${this.uid}"]::after`]: {
        content: css.attr("current"),
        fontWeight: css.important("initial"),
      },
    });
    /* Use/unuse sheet as per connect lifecycle */
    this.on._connect$once = (event) => sheet.use();
    this.on._disconnect$once = (event) => sheet.unuse();
    /* Connect */
    layout.append(this);
  });

  const state = RefComponent(
    {
      parent: layout,
      current: 0,
      owner: button,
      name: "state",
    },
    function () {
      /* current -> button attribute */
      this.effects.add((current, message) => {
        this.owner.attribute.current = this.current;
      });
      /* click -> update state */
      this.owner.on.click = (event) => {
        this.current += 1;
      };
    }
  );
};

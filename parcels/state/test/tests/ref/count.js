/*
ref/count.js
*/

const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");
const { Sheet, css } = await use("@/sheet.js");
const sheet = Sheet.create();

export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");

  sheet.rules.clear();

  const menu = component.menu({
    parent: layout,
    width: css.pct(100),
    ...css.display.flex,
    ...css.justifyContent.end,
    columnGap: css.rem(1),
    paddingRight: css.rem(1),
  });

  /* 
  Tree:
  - Ref component envelops span.

  Styling:
  - Hard styling.
  - Ref component show as button.
  
  State -> ui:
  - Effect updates span text.
  */
  (() => {
    const state = RefComponent(
      "btn.btn-primary",
      {
        parent: menu,
        current: 0,
        fontWeight: String(700),
      },
      "Count: ",
      function () {
        const span = component.span({ parent: this, fontWeight: String(400) });
        /* current -> text */
        this.effects.add((current) => span.text = `${current}`);
        /* click -> update state */
        this.on.click = (event) => this.current += 1;
      }
    );
  })();

  /* 
  Tree:
  - Ref component envelops button.

  Styling:
  - Dynamic sheet scoped to button uid.
  - Ref component show as button.
  
  State -> ui:
  - Effect transfers current to button attribute.
  - Psudo element in dynamic sheet displays button attribute.
  */
  (() => {
    const state = RefComponent(
      {
        current: 0,
      },
      function () {
        const button = component.button(
          "btn.btn-primary",
          { parent: this },
          "Count: "
        );
        /* Create rules scoped to button uid */
        sheet.rules.add({
          [`[uid="${button.uid}"]`]: {
            fontWeight: css.important(700),
          },

          [`[uid="${button.uid}"]::after`]: {
            content: css.attr("current"),
            fontWeight: css.important("initial"),
          },
        });
        /* Use/unuse sheet as per connect lifecycle */
        this.on._connect$once = (event) => sheet.use();
        this.on._disconnect$once = (event) => sheet.unuse();
        /* Connect */
        menu.append(this);

        /* current -> button attribute */
        this.effects.add((current, message) => button.attribute.current = current);
        /* click -> update state */
        this.on.click = (event) => this.current += 1;
      }
    );
  })();

  /* ; show count via css; styled with dynamic sheet */
  (() => {
    const button = component.button("btn.btn-primary", "Count: ", function () {
      const state = RefComponent({ current: 0, parent: this });

      /* Create rules */
      sheet.rules.add({
        [`[uid="${this.uid}"]`]: {
          fontWeight: css.important(700),
        },

        [`[uid="${state.uid}"]::after`]: {
          content: css.attr("current"),
          fontWeight: css.important("initial"),
        },
      });
      /* Use/unuse sheet as per connect lifecycle */
      this.on._connect$once = (event) => sheet.use();
      this.on._disconnect$once = (event) => sheet.unuse();
      /* Connect */
      menu.append(this);

      /* click -> update state */
      this.on.click = (event) => state.current += 1;
    });
  })();
};

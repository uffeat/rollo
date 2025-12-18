/*
/state/ref/count/option4.test.js
*/

const { ref, component, Sheet, declare, scope } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");

const sheet = Sheet.create();

export default async () => {
  frame.clear(":not([slot])");

  sheet.rules.clear();

  const menu = component.menu();

  sheet.rules.add({
    [scope(menu)]: {
      width: declare.pct(100),
      ...declare.display.flex,
      ...declare.justifyContent.flexEnd,
      ...declare.flexWrap.wrap,
      columnGap: declare.rem(1),
      rowGap: declare.rem(1),
      paddingRight: declare.rem(1),
    },
  });

  /* Use/unuse sheet as per connect lifecycle */
  menu.on._connect({ once: true }, (event) => sheet.use());
  menu.on._disconnect({ once: true }, (event) => sheet.unuse());
  /* Connect */
  frame.append(menu);

  /* 
  Structure:
  - Button envelops span.
  - No ref component; reactivity established with ref proxy.

  Styling:
  - Dynamic sheet scoped to button uid.
  - Sheet does not participate in reactivity.

  State -> ui:
  - Effect updates span text.
  */
  component.button(
      "btn.btn-primary",
      {
        parent: menu,
        text: "Count: ",
      },
      function () {
        /* Create rules */
        sheet.rules.add({
          [scope(this)]: {
            fontWeight: declare.important(700),
          },

          [`${scope(this)} > span`]: {
            fontWeight: declare.important("initial"),
          },
        });
        const span = component.span({ parent: this });
        const state = ref(0, (current) => (span.text = current));
        this.on.click = (event) => (state.current += 1);
      }
    );
};

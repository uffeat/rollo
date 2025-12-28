/*
/state/ref/count/option4.test.js
*/

const { ref, component, Sheet, css } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");

const sheet = Sheet.create();

export default async () => {
  frame.clear(":not([slot])");

  sheet.rules.clear();

  const menu = component.menu();

  sheet.rules.add({
    [css(menu)]: {
      width: css.pct(100),
      ...css.display.flex,
      ...css.justifyContent.flexEnd,
      ...css.flexWrap.wrap,
      columnGap: css.rem(1),
      rowGap: css.rem(1),
      paddingRight: css.rem(1),
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
          [css(this)]: {
            fontWeight: css.important(700),
          },

          [`${css(this)} > span`]: {
            fontWeight: css.important("initial"),
          },
        });
        const span = component.span({ parent: this });

        const state = ref(0, (current) => {

          console.log('current:', current)


          span.text = current
        });

        console.log('state.current:', state.current)


        this.on.click((event) => {
          state.current += 1
        });
      }
    );
};

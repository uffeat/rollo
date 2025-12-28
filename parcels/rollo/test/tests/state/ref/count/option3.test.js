/*
/state/ref/count/option3.test.js
*/

const { refMixin, Mixins, author, component, mix, Sheet, css } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");

const sheet = Sheet.create();

const RefComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins(refMixin)) {},
  "ref-component"
);

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
  - Button envelops ref component.
  - Button acts as presentation, as style container and event target.
  - Ref component acts as state-aware presentation.

  Styling:
  - Dynamic sheet scoped to button uid.
  - Sheet participates in reactivity.

  State -> ui:
  - Psudo element in dynamic sheet displays ref component attribute.
  */
  component.button(
    "btn.btn-primary",
    { parent: menu, text: "Count: " },
    function () {
      const state = RefComponent({ current: 0, parent: this });
      /* Create rules */
      sheet.rules.add({
        [css(this)]: {
          fontWeight: css.important(700),
        },

        [`${css(this)} > ref-component::after`]: {
          content: css.attr("current"),
          fontWeight: css.important("initial"),
        },
      });
      /* click -> update state */
      this.on.click = (event) => (state.current += 1);
    }
  );
};

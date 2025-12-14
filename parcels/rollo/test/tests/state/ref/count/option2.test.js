/*
/state/ref/count/option2.test.js
*/

const { refMixin, Mixins, author, component, mix, Sheet, css, scope } =
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
    [scope(menu)]: {
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
  - Ref component envelops button.
  - Ref component acts as state-aware container.
  - Button is pure presentation.

  Styling:
  - Dynamic sheet scoped to button uid. 
  - Sheet participates in reactivity.
  
  State -> ui:
  - Effect transfers current to button attribute.
  - Psudo element in dynamic sheet displays button attribute.
  */
  RefComponent(
    {
      current: 0,
      parent: menu,
    },
    function () {
      const button = component.button(
        "btn.btn-primary",
        { parent: this },
        "Count: "
      );
      /* Create rules scoped to button uid */
      sheet.rules.add({
        [scope(button)]: {
          fontWeight: css.important(700),
        },

        [`${scope(button)}::after`]: {
          content: css.attr("current"),
          fontWeight: css.important("initial"),
        },
      });

      /* current -> button attribute */
      this.effects.add(
        (current, message) => (button.attribute.current = current)
      );
      /* click -> update state */
      this.on.click = (event) => (this.current += 1);
    }
  );
};

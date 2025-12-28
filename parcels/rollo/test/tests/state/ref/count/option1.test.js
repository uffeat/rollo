/*
/state/ref/count/option1.test.js
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
  - Ref component envelops span.

  Styling:
  - Hard styling.
  - Ref component shown as button.
  
  State -> ui:
  - Effect updates span text.
  */
  RefComponent(
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
      this.effects.add((current) => (span.text = `${current}`));
      /* click -> update state */
      this.on.click = (event) => (this.current += 1);
    }
  );
};

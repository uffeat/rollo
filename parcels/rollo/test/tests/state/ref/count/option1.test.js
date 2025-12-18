/*
/state/ref/count/option1.test.js
*/

const { refMixin, Mixins, author, component, mix, Sheet, declare, scope } =
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

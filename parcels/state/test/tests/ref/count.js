/*
/ref/count.js
*/




const { Mixins, author, component, mix } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Sheet, css, scope } = await use("@/sheet.js");

const { refMixin } = await use("@/state.js");


const sheet = Sheet.create();

const RefComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins(refMixin)) {},
  "ref-component"
);

export default async ({ ref }) => {
  layout.clear(":not([slot])");

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
  menu.on._connect$once = (event) => sheet.use();
  menu.on._disconnect$once = (event) => sheet.unuse();
  /* Connect */
  layout.append(menu);

  /* 
  Structure:
  - Ref component envelops span.

  Styling:
  - Hard styling.
  - Ref component shown as button.
  
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
        this.effects.add((current) => (span.text = `${current}`));
        /* click -> update state */
        this.on.click = (event) => (this.current += 1);
      }
    );
  })();

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
  (() => {
    const state = RefComponent(
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
  })();

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
  (() => {
    const button = component.button(
      "btn.btn-primary",
      { parent: menu, text: "Count: " },
      function () {
        const state = RefComponent({ current: 0, parent: this });
        /* Create rules */
        sheet.rules.add({
          [scope(this)]: {
            fontWeight: css.important(700),
          },

          [`${scope(this)} > ref-component::after`]: {
            content: css.attr("current"),
            fontWeight: css.important("initial"),
          },
        });
        /* click -> update state */
        this.on.click = (event) => (state.current += 1);
      }
    );
  })();

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
  (() => {
    const button = component.button(
      "btn.btn-primary",
      {
        parent: menu,
        text: "Count: ",
      },
      function () {
        /* Create rules */
        sheet.rules.add({
          [scope(this)]: {
            fontWeight: css.important(700),
          },

          [`${scope(this)} > span`]: {
            fontWeight: css.important("initial"),
          },
        });
        const span = component.span({ parent: this });
        const state = ref(0, (current) => (span.text = current));
        this.on.click = (event) => (state.current += 1);
      }
    );
  })();

  await (async () => {
    const { author, component, factory, mix, mixins, registry } = await use(
      "@/component.js"
    );

    const TestComponent = registry.has("test-component")
      ? factory(registry.get("test-component"))
      : author(
          class extends mix(
            HTMLElement,
            {},
            mixins.append,
            mixins.attrs,
            mixins.classes,
            mixins.clear,
            mixins.connect,
            mixins.detail,
            mixins.find,
            mixins.handlers,
            mixins.insert,
            mixins.parent,
            mixins.props,
            mixins.send,
            mixins.style,
            mixins.text,
            mixins.uid,
            mixins.vars,
            refMixin
          ) {
            static sheet = null;

            constructor(...args) {
              super(...args);
              if (!this.constructor.sheet) {
                this.constructor.sheet = Sheet.create();
                this.constructor.sheet.rules.add({
                  "test-component > button.test": {
                    fontWeight: String(700),
                  },

                  "test-component > button > span": {
                    fontWeight: "initial",
                  },
                });

                //this.constructor.sheet.use();
              }
            }

            __new__(...args) {
              super.__new__?.(...args);
              /* Use/unuse sheet as per connect lifecycle */
              this.on._connect$once = (event) => this.constructor.sheet.use();
              this.on._disconnect$once = (event) =>
                this.constructor.sheet.unuse();

              const button = component.button(
                /* Add test class to bump-up specificity and thereby overwrite Bootstrap defaults */
                "btn.btn-primary.test",
                { parent: this },
                "Count: "
              );

              const span = component.span({ parent: button });
              this.effects.add((current) => (span.text = current));
              this.on.click = (event) => (this.current += 1);
            }
          },
          "test-component"
        );

    const testComponent = TestComponent({ parent: menu, current: 0 });
  })();
};

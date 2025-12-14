/*
/state/reactive/mixin.test.js
*/

/* TODO
- Make the purpose of this test clear!
- Make something happen when the component is clicked (expected for a button)
*/
const { stateMixin, Sheet, Mixins, author, factory, mix, registry } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const sheet = Sheet.create();

export default async () => {
  frame.clear(":not([slot])");

  await (async () => {
    const TAG = "button";

    const TestComponent = registry.has("test-component")
      ? factory(registry.get("test-component"))
      : author(
          class extends mix(
            document.createElement(TAG).constructor,
            {},
            ...Mixins(stateMixin)
          ) {
            static sheet = null;

            constructor(...args) {
              super(...args);
              if (!this.constructor.sheet) {
                this.constructor.sheet = Sheet.create();
                this.constructor.sheet.rules.add({});
              }
            }

            __new__(...args) {
              super.__new__?.(...args);
              /* Use/unuse sheet as per connect lifecycle */
              this.on._connect$once = (event) => this.constructor.sheet.use();
              this.on._disconnect$once = (event) =>
                this.constructor.sheet.unuse();

              this.on.click = (event) => null; ////
            }
          },
          "test-component",
          TAG
        );

    const testComponent = TestComponent({ parent: frame });

    testComponent.$({
      text: "My button",
      "[myBar]": true,
      ".ding": true,
      __stuff: null,
      foo: 42,
    });

    testComponent.$.text = "Reactive button";
    testComponent.update({ $dong: "DONG" });
  })();
};

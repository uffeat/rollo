import "../../use";
const { Mixins, author, mix, stateMixin } = await use("@/rollo/");

const TAG = "form";

export const Form = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(stateMixin),
  ) {
    #_ = {};
    constructor() {
      super();
    }

    __new__(...args) {
      super.__new__?.(...args);
      this.attribute[this.constructor.__key__] = true;
      this.attribute.webComponent = true;
      this.noValidate = true;
    }

    get data() {
      const result = {};
      const controls = this.children;
      for (const control of controls) {
        result[control.name] = control.value;
      }
      return result;
    }

    get valid() {
      return this.$.valid;
    }

    validate() {
      const controls = this.children;
      for (const control of controls) {
        if (!control.valid) {
          this.$.valid = false;
          return false;
        }
      }
      this.$.valid = true;
      return true;
    }
  },
  "form-component",
  TAG,
);

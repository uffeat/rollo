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

    get controls() {
      const controls = Array.from(this.children).filter((c) => c.attribute.formControl);
      return controls;
    }

    get data() {
      const result = {};
      for (const control of this.controls) {
        result[control.name] = control.value;
      }
      return result;
    }

    get valid() {
      return this.$.valid;
    }

    validate() {
      for (const control of this.controls) {
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

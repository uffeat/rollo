import "../use";
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
      this.attribute.webComponent = true;
      this.noValidate = true

    }
  },
  "form-component",
  TAG,
);

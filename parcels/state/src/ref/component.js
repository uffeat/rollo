import refMixin from "./mixin.js";

const { Mixins, author, mix } = await use("@/component.js");

export const RefComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins(refMixin)) {},
  "ref-component"
);

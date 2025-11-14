import stateMixin from "./mixin.js";

const { Mixins, author, mix } = await use("@/component.js");

export const ReactiveComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {},
  "reactive-component"
);

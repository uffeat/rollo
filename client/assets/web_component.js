const { Mixins, author, mix  } = await use("@/component.js");

export const WebComponent = author(
  class extends mix(HTMLElement, {}, ...Mixins()) {},
  "web-component"
);

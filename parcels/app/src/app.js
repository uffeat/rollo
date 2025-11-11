import "../assets/app.css";

const { Mixins, author, component, mix } = await use("@/component.js");

const TAG = "div";

const App = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(),
  ) {
    #_ = {};
    constructor() {
      super();
      this.#_.slot = component.slot();
      this.#_.dataSlot = component.slot({name: 'data'});
      this.#_.shadow = component.div({ id: "root" }, this.#_.slot, this.#_.dataSlot);
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.attribute.app = true;
      this.attribute.webComponent = true;
    }
  },
  "app-component",
  TAG
);

export const app = App({ id: "app", parent: document.body });

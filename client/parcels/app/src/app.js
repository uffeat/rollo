import "../use.js";
import '../assets/app.css'

const { author, component, mix, mixins } = await use("/component.js");


const TAG = "div";

export const App = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    mixins.append,
    mixins.attrs,
    mixins.classes,
    mixins.clear,
    mixins.detail,
    mixins.find,
    mixins.handlers,
    mixins.insert,
    mixins.parent,
    mixins.props,
    mixins.send,
    mixins.style,
    mixins.vars
  ) {
    #_ = {};
    constructor() {
      super();
      this.#_.slot = component.slot();
      this.#_.shadow = component.div({ id: "root" }, this.#_.slot);
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.attribute.app = true;
      this.attribute.webComponent = true;
    }
  },
  "app-component",
  TAG
);

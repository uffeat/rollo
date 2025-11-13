import "../assets/app.css";

const { Mixins, author, component, mix } = await use("@/component.js");
const { stateMixin } = await use("@/state.js");

const TAG = "div";

const App = author(
  class extends mix(document.createElement(TAG).constructor, {}, ...Mixins(stateMixin)) {
    #_ = {};
    constructor() {
      super();
      this.#_.slot = component.slot();
      this.#_.dataSlot = component.slot({ name: "data" });
      this.#_.shadow = component.div(
        { id: "root" },
        this.#_.slot,
        this.#_.dataSlot
      );
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.attribute.app = true;
      this.attribute.webComponent = true;
    }
  },
  "app-component",
  TAG
);

export const app = App({ id: "app", parent: document.body });

export const breakpoints = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
})


/* Breakpoints */
for (const [key, value] of Object.entries(breakpoints)) {
  const query = window.matchMedia(`(width >= ${value}px)`);
  /* Handle initial */
  app.$[key] = query.matches
  query.addEventListener("change", (event) => {
    app.$[key] = event.matches
  });
}



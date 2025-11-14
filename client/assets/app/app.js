const { Mixins: s, author: a, component: t, mix: e } = await use("@/component.js"), o = "div", n = a(
  class extends e(
    document.createElement(o).constructor,
    {},
    ...s()
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = t.slot(), this.#t.dataSlot = t.slot({ name: "data" }), this.#t.shadow = t.div({ id: "root" }, this.#t.slot, this.#t.dataSlot), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  o
), p = n({ id: "app", parent: document.body });
export {
  p as app
};

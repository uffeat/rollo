const { author: e, component: s, mix: a, mixins: t } = await use("@/component.js"), o = "div", n = e(
  class extends a(
    document.createElement(o).constructor,
    {},
    t.append,
    t.attrs,
    t.classes,
    t.clear,
    t.detail,
    t.find,
    t.handlers,
    t.insert,
    t.parent,
    t.props,
    t.send,
    t.style,
    t.vars
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = s.slot(), this.#t.dataSlot = s.slot({ name: "data" }), this.#t.shadow = s.div({ id: "root" }, this.#t.slot, this.#t.dataSlot), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  o
), p = n({ id: "app", parent: document.body });
export {
  n as App,
  p as app
};

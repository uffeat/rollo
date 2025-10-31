const { author: o, component: s, mix: n, mixins: t } = await use("@/component.js"), e = "div", a = o(
  class extends n(
    document.createElement(e).constructor,
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
      super(), this.#t.slot = s.slot(), this.#t.shadow = s.div({ id: "root" }, this.#t.slot), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  e
), p = a({ id: "app", parent: document.body });
export {
  a as App,
  p as app
};

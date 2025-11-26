const { Mixins: c, author: d, component: t, mix: p } = await use("@/component"), { stateMixin: r } = await use("@/state"), s = "div", h = d(
  class extends p(document.createElement(s).constructor, {}, ...c(r)) {
    #t = {};
    constructor() {
      super(), this.#t.slot = t.slot(), this.#t.dataSlot = t.slot({ name: "data" }), this.#t.shadow = t.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  s
), a = h({ id: "app", parent: document.body }), m = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});
for (const [e, n] of Object.entries(m)) {
  const o = window.matchMedia(`(width >= ${n}px)`);
  a.$[e] = o.matches, o.addEventListener("change", (i) => {
    a.$[e] = i.matches;
  });
}
export {
  a as app,
  m as breakpoints
};

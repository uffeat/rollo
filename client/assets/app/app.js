const { Mixins: d, author: p, component: s, mix: r } = await use("@/component"), { stateMixin: h } = await use("@/state"), c = "div", m = p(
  class extends r(document.createElement(c).constructor, {}, ...d(h)) {
    #t = {};
    constructor() {
      super(), this.#t.slot = s.slot(), this.#t.dataSlot = s.slot({ name: "data" }), this.#t.shadow = s.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  c
), e = m({ id: "app", parent: document.body }), l = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});
for (const [t, i] of Object.entries(l)) {
  const o = window.matchMedia(`(width >= ${i}px)`), a = o.matches;
  e.$[t] = a, e.send(`_break_${t}`, { detail: a }), o.addEventListener("change", (u) => {
    const n = o.matches;
    e.$[t] = n, e.send(`_break_${t}`, { detail: n });
  });
}
export {
  e as app,
  l as breakpoints
};

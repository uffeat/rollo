const { Exception: r } = await use("@/tools/exception.js"), { is: c } = await use("@/tools/is.js"), { type: d } = await use("@/tools/type.js"), { Reactive: h, Ref: u, ref: p, reactive: f } = await use("@/state.js"), i = new class {
  #t = {
    added: /* @__PURE__ */ new Map()
  };
  constructor() {
    this.#t.state = u.create({ owner: this, name: "router" });
  }
  get effects() {
    return this.#t.state.effects;
  }
  add(t, e) {
    this.#t.added.set(t, e);
  }
  /* */
  async set(t, e = !1) {
    t === "/" && this.#t.home && (t = this.#t.home);
    const s = `/${t.split("/").at(1)}`;
    this.#t.state.update(s);
    const n = t.split("/").slice(2).join("/");
    return this.#t.previous === s ? this : (this.#t.previous = s, e === !1 && history.pushState({}, "", s), app.$({ path: s }), this.#t.added.has(s) ? await this.#t.added.get(s)({ current: s, residual: n, router: this }) : await (await use(`@${s}.js`)).default({ current: s, residual: n, router: this }), this);
  }
  /* */
  async setup(t) {
    return this.#t.home = t, this.set(location.pathname, !0), this;
  }
}();
window.addEventListener("popstate", async (a) => {
  await i.set(location.pathname, !0);
});
const w = new Proxy(async () => {
}, {
  get(a, t) {
    r.if(!(t in i), `Invalid key: ${t}`);
    const e = i[t];
    return typeof e == "function" ? e.bind(i) : e;
  },
  set(a, t, e) {
    return r.if(!(t in i), `Invalid key: ${t}`), i[t] = e, !0;
  },
  apply(a, t, e) {
    return i.set(...e);
  }
});
export {
  w as router
};

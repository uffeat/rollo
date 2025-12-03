const { Exception: p } = await use("@/tools/exception"), { type: j } = await use("@/tools/type"), O = /* @__PURE__ */ new Set(["AsyncFunction", "Function", "Module", "Object"]);
class l {
  static create = (...t) => new l(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [e, r] of Object.entries(t)) {
      const s = j(r);
      p.if(!O.has(s), `Invalid route type: ${s}`), p.if(
        (s === "Module" || s === "Object") && r.default && typeof r.default != "function",
        `Invalid default member (expected a function; got type: ${s})`,
        () => console.error("default:", r.default)
      ), this.#t.registry.set(e, { route: r });
    }
  }
  async get(t) {
    const e = this.#t.registry.get(t);
    if (typeof e.route == "function")
      return e.route;
    if (typeof e.route.default == "function")
      return e.route = await e.route.default(), e.route;
  }
  has(t) {
    return this.#t.registry.has(t);
  }
  remove(t) {
    return this.#t.registry.delete(t);
  }
}
const m = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([r, s]) => {
          if (s = s.trim(), s === "") return [r, !0];
          if (s === "true") return [r, !0];
          const n = Number(s);
          return [r, Number.isNaN(n) ? s : n];
        }).filter(([r, s]) => !["false", "null", "undefined"].includes(s))
      )
    );
  }
  stringify(t) {
    return t = Object.fromEntries(
      Object.entries(t).filter(
        ([e, r]) => ![!1, null, void 0].includes(r)
      )
    ), "?" + new URLSearchParams(t).toString().replaceAll("=true", "");
  }
}(), { match: v } = await use("@/tools/object/match");
class f {
  static create = (...t) => new f(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const r = e.search;
    this.#t.hash = e.hash, this.#t.query = m.parse(r), this.#t.full = r ? `${this.path}${r}${this.hash}` : `${this.path}${this.hash}`;
  }
  get full() {
    return this.#t.full;
  }
  get hash() {
    return this.#t.hash;
  }
  get path() {
    return this.#t.path;
  }
  get query() {
    return this.#t.query;
  }
  match(t) {
    return t.path === this.path && t.hash === this.hash && v(t.query, this.query);
  }
}
const { component: c } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: E } = await use("@/state"), b = E(), x = c.main(
  "container",
  c.h1({ text: "Page not found" })
), y = c.p({ parent: x });
b.effects.add((i) => {
  i ? y.text = `Invalid path: ${i}.` : y.clear();
});
const _ = (i) => {
  d.clear(":not([slot])"), d.append(x), b(i);
}, { app: z } = await use("@/app/"), { ref: L } = await use("@/state"), o = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new l(), this.#t.states = {
      path: L({ owner: this, name: "path" })
    };
  }
  /* Returns effects controller. */
  get effects() {
    return this.#t.states.path.effects;
  }
  /* Returns route registration controller. */
  get routes() {
    return this.#t.routes;
  }
  /* Set route registration controller. */
  set routes(t) {
    this.#t.routes = t;
  }
  error(...t) {
    return this.#t.config.error(...t);
  }
  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error: t = _, redirect: e, routes: r, strict: s = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = s, Object.assign(this.#t.config.redirect, e), r && this.routes.add({ ...r }), this.#t.initialized || (window.addEventListener("popstate", async (n) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: e, strict: r } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), r = r === void 0 ? this.#t.config.strict : r;
    const s = f.create(t), n = this.#t.url ? s.match(this.#t.url) ? void 0 : (this.#t.url = s, () => {
      e || history.pushState({}, "", s.full);
    }) : (this.#t.url = s, () => {
      e || history.pushState({}, "", s.full);
    });
    if (!n)
      return this;
    this.#t.session++;
    const h = await (async () => {
      const { path: q, residual: u, route: a } = await this.#r(s.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(q, s.query, ...u), a === this.#t.route ? a.update ? await a.update(
          { session: this.#t.session },
          s.query,
          ...u
        ) : await a(
          { mode: "update", session: this.#t.session, update: !0 },
          s.query,
          ...u
        ) : (this.#t.route && (this.#t.route.exit ? await this.#t.route.exit({ session: this.#t.session }) : await this.#t.route({
          exit: !0,
          mode: "exit",
          session: this.#t.session
        })), a.enter ? await a.enter(
          { session: this.#t.session },
          s.query,
          ...u
        ) : await a(
          { enter: !0, mode: "enter", session: this.#t.session },
          s.query,
          ...u
        ), this.#t.route = a);
      };
    })();
    return h ? (n(), await h(), this) : (n(), this.#e(s.path, s.query), r && this.#t.config.error(s.path), this);
  }
  async #r(t) {
    const e = t.slice(1).split("/");
    for (let r = e.length - 1; r >= 0; r--) {
      const s = `/${e.slice(0, r + 1).join("/")}`;
      if (this.routes.has(s)) {
        const n = e.slice(r + 1), h = await this.routes.get(s);
        return { path: s, route: h, residual: n };
      }
    }
  }
  /* Enables external hooks etc. */
  #e(t, e, ...r) {
    z.$({ path: t }), this.#t.states.path(t, {}, e, ...r);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: g } = await use("@/tools/exception"), $ = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return o;
    g.if(!(t in o), `Invalid key: ${t}`);
    const e = o[t];
    return typeof e == "function" ? e.bind(o) : e;
  },
  set(i, t, e) {
    return g.if(!(t in o), `Invalid key: ${t}`), o[t] = e, !0;
  },
  apply(i, t, e) {
    return o.use(...e);
  },
  deleteProperty(i, t) {
    o.routes.remove(t);
  },
  has(i, t) {
    return o.routes.has(t);
  }
}), P = (i) => ($.effects.add(
  (t) => {
    const e = i.find("[selected]");
    e && (e.selected = !1);
    const r = i.find(`[path="${t}"]`);
    r && (r.selected = !0);
  },
  (t) => !!t
), i), { Mixins: N, author: R, mix: S } = await use("@/component"), { stateMixin: A } = await use("@/state"), w = "a", F = R(
  class extends S(
    document.createElement(w).constructor,
    {},
    ...N(A)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (i) => {
        if (this.path) {
          i.preventDefault();
          const t = this.#t.query ? this.path + m.stringify(this.#t.query) : this.path;
          await $(t);
        }
      };
    }
    get path() {
      return this.attribute.path;
    }
    set path(i) {
      this.attribute.path = i;
    }
    get query() {
      if (this.#t.query)
        return Object.freeze({ ...this.#t.query });
    }
    set query(i) {
      this.#t.query = i;
    }
    get selected() {
      return this.attribute.selected || !1;
    }
    set selected(i) {
      this.attribute.selected = i;
    }
  },
  "nav-link",
  w
);
export {
  P as Nav,
  F as NavLink,
  m as Query,
  o as Router,
  l as Routes,
  f as Url,
  $ as router
};

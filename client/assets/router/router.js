class c {
  static create = (...t) => new c(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [r, s] of Object.entries(t))
      this.#t.registry.set(r, s);
  }
  get(t) {
    return this.#t.registry.get(t);
  }
  has(t) {
    return this.#t.registry.has(t);
  }
  remove(t) {
    return this.#t.registry.delete(t);
  }
}
const d = new class {
  parse(t) {
    const r = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(r), ([s, e]) => {
          if (e = e.trim(), e === "") return [s, !0];
          if (e === "true") return [s, !0];
          const n = Number(e);
          return [s, Number.isNaN(n) ? e : n];
        }).filter(([s, e]) => !["false", "null", "undefined"].includes(e))
      )
    );
  }
  stringify(t) {
    return t = Object.fromEntries(
      Object.entries(t).filter(
        ([r, s]) => ![!1, null, void 0].includes(s)
      )
    ), "?" + new URLSearchParams(t).toString().replaceAll("=true", "");
  }
}(), { match: w } = await use("@/tools/object/match");
class l {
  static create = (...t) => new l(...t);
  #t = {};
  constructor(t) {
    const r = new URL(t, location.origin);
    this.#t.path = r.pathname;
    const s = r.search;
    this.#t.hash = r.hash, this.#t.query = d.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && w(t.query, this.query);
  }
}
const { app: m } = await use("@/app/"), { ref: b } = await use("@/state"), o = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new c(), this.#t.states = {
      path: b({ owner: this, name: "path" })
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
  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error: t, redirect: r, routes: s, strict: e = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = e, Object.assign(this.#t.config.redirect, r), s && this.routes.add({ ...s }), this.#t.initialized || (window.addEventListener("popstate", async (n) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: r, strict: s } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), s = s === void 0 ? this.#t.config.strict : s;
    const e = l.create(t), n = this.#t.url ? e.match(this.#t.url) ? void 0 : (this.#t.url = e, () => {
      r || history.pushState({}, "", e.full);
    }) : (this.#t.url = e, () => {
      r || history.pushState({}, "", e.full);
    });
    if (!n)
      return this;
    this.#t.session++;
    const u = await (async () => {
      const { path: y, residual: h, route: a } = await this.#r(e.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(y, e.query, ...h), a === this.#t.route ? a.update ? await a.update(
          { session: this.#t.session },
          e.query,
          ...h
        ) : await a(
          { mode: "update", session: this.#t.session, update: !0 },
          e.query,
          ...h
        ) : (this.#t.route && (this.#t.route.exit ? await this.#t.route.exit({ session: this.#t.session }) : await this.#t.route({ exit: !0, mode: "exit", session: this.#t.session })), a.enter ? await a.enter(
          { session: this.#t.session },
          e.query,
          ...h
        ) : await a(
          { enter: !0, mode: "enter", session: this.#t.session },
          e.query,
          ...h
        ), this.#t.route = a);
      };
    })();
    return u ? (n(), await u(), this) : (n(), this.#e(e.path, e.query), s && (this.#t.config.error || (this.#t.config.error = (await use("/pages/error.js")).default), await this.#t.config.error(e.path)), this);
  }
  async #r(t) {
    const r = t.slice(1).split("/");
    for (let s = r.length - 1; s >= 0; s--) {
      const e = `/${r.slice(0, s + 1).join("/")}`;
      if (this.routes.has(e)) {
        const n = r.slice(s + 1), u = this.routes.get(e);
        return { path: e, route: u, residual: n };
      }
    }
    for (const s of ["/", "@/", "@@/"])
      try {
        const e = (await use(`${s}pages${t}.x.html`))();
        return { path: t, route: e, residual: [] };
      } catch (e) {
        if (e.name !== "UseError")
          throw e;
      }
  }
  /* Enables external hooks etc. */
  #e(t, r, ...s) {
    m.$({ path: t }), this.#t.states.path(t, {}, r, ...s);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: f } = await use("@/tools/exception"), g = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return o;
    f.if(!(t in o), `Invalid key: ${t}`);
    const r = o[t];
    return typeof r == "function" ? r.bind(o) : r;
  },
  set(i, t, r) {
    return f.if(!(t in o), `Invalid key: ${t}`), o[t] = r, !0;
  },
  apply(i, t, r) {
    return o.use(...r);
  },
  deleteProperty(i, t) {
    o.routes.remove(t);
  },
  has(i, t) {
    return o.routes.has(t);
  }
}), E = (i) => (g.effects.add(
  (t) => {
    const r = i.find("[selected]");
    r && (r.selected = !1);
    const s = i.find(`[path="${t}"]`);
    s && (s.selected = !0);
  },
  (t) => !!t
), i), { Mixins: $, author: q, mix: x } = await use("@/component"), { stateMixin: j } = await use("@/state"), p = "a", L = q(
  class extends x(
    document.createElement(p).constructor,
    {},
    ...$(j)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (i) => {
        if (this.path) {
          i.preventDefault();
          const t = this.#t.query ? this.path + d.stringify(this.#t.query) : this.path;
          await g(t);
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
  p
);
export {
  E as Nav,
  L as NavLink,
  d as Query,
  o as Router,
  l as Url,
  g as router
};

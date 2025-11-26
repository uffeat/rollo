const y = new class {
  parse(t) {
    const s = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(s), ([e, r]) => {
          if (r = r.trim(), r === "") return [e, !0];
          if (r === "true") return [e, !0];
          const u = Number(r);
          return [e, Number.isNaN(u) ? r : u];
        }).filter(([e, r]) => !["false", "null", "undefined"].includes(r))
      )
    );
  }
  stringify(t) {
    return t = Object.fromEntries(
      Object.entries(t).filter(
        ([s, e]) => ![!1, null, void 0].includes(e)
      )
    ), "?" + new URLSearchParams(t).toString().replaceAll("=true", "");
  }
}();
class c {
  static create = (...t) => new c(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [s, e] of Object.entries(t))
      this.#t.registry.set(s, e);
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
const { reactive: L, ref: d } = await use("@/state.js"), { Exception: m } = await use("@/tools/exception.js");
class l {
  static create = (...t) => new l(...t);
  #t = {};
  constructor(t) {
    this.#t.path = d({ owner: t, name: "path" }), this.#t.effects = new Proxy(this, {
      get(s, e) {
        return m.if(!(e in s), `Invalid key: ${e}.`), s[e].effects;
      }
    });
  }
  get effects() {
    return this.#t.effects;
  }
  get path() {
    return this.#t.path;
  }
}
const { match: x } = await use("@/tools/object/match.js");
class f {
  static create = (...t) => new f(...t);
  #t = {};
  constructor(t) {
    const s = new URL(t, location.origin);
    this.#t.path = s.pathname;
    const e = s.search;
    this.#t.hash = s.hash, this.#t.query = y.parse(e), this.#t.full = e ? `${this.path}${e}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && x(t.query, this.query);
  }
}
const { app: $ } = await use("@/app/"), n = new class {
  #t = {
    config: {},
    route: async () => {
    },
    routes: null,
    session: 0,
    states: {},
    url: null
  };
  constructor() {
    this.#t.routes = new c(), this.#t.states = new l(this);
  }
  get config() {
    return Object.freeze({ ...this.#t.config });
  }
  /* Returns multi-state effect controller. */
  get effects() {
    return this.#t.states.effects;
  }
  /* Returns current route. */
  get route() {
    return this.#t.route;
  }
  /* Returns route registration controller. */
  get routes() {
    return this.#t.routes;
  }
  /* Returns session uid. */
  get session() {
    return this.#t.session;
  }
  /* Returns info about current: 
  - path: pathname
  - query: search as object
  - hash: hash
  - full: href without host
  */
  get url() {
    return this.#t.url;
  }
  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error: t, strict: s = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = s, this.#t.initialized || (window.addEventListener("popstate", async (e) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: s, strict: e } = {}) {
    e = e === void 0 ? this.#t.config.strict : e;
    const r = f.create(t), u = this.url ? r.match(this.url) ? void 0 : (this.#t.url = r, () => {
      s || history.pushState({}, "", r.full);
    }) : (this.#t.url = r, () => {
      s || history.pushState({}, "", r.full);
    });
    if (!u)
      return this;
    this.#t.session++;
    const h = await (async () => {
      const { path: w, residual: o, route: a } = await this.#r(r.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(w, r.query, ...o), a === this.route ? a.update ? await a.update(r.query, ...o) : await a({ update: !0 }, r.query, ...o) : (this.route && (this.route.exit ? await this.route.exit() : await this.route({ exit: !0 })), a.enter ? await a.enter(r.query, ...o) : await a({ enter: !0 }, r.query, ...o), this.#t.route = a);
      };
    })();
    return h ? (u(), await h(), this) : (u(), this.#e(r.path, r.query), e && (this.#t.config.error || (this.#t.config.error = (await use("/pages/error.js")).default), await this.#t.config.error(r.path)), this);
  }
  async #r(t) {
    const s = t.slice(1).split("/");
    for (let e = s.length - 1; e >= 0; e--) {
      const r = `/${s.slice(0, e + 1).join("/")}`;
      if (this.routes.has(r)) {
        const u = s.slice(e + 1), h = this.routes.get(r);
        return { path: r, route: h, residual: u };
      }
    }
    for (const e of ["/", "@/", "@@/"])
      try {
        const r = (await use(`${e}pages${t}.x.html`))();
        return { path: t, route: r, residual: [] };
      } catch (r) {
        if (r.name !== "UseError")
          throw r;
      }
  }
  /* Enables external hooks etc. */
  #e(t, s, ...e) {
    $.$({ path: t }), this.#t.states.path(t, {}, s, ...e);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: p } = await use("@/tools/exception.js"), b = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return n;
    p.if(!(t in n), `Invalid key: ${t}`);
    const s = n[t];
    return typeof s == "function" ? s.bind(n) : s;
  },
  set(i, t, s) {
    return p.if(!(t in n), `Invalid key: ${t}`), n[t] = s, !0;
  },
  apply(i, t, s) {
    return n.use(...s);
  },
  deleteProperty(i, t) {
    n.routes.remove(t);
  },
  has(i, t) {
    return n.routes.has(t);
  }
}), { Mixins: q, author: j, mix: v } = await use("@/component.js"), { stateMixin: E } = await use("@/state.js"), g = "a", R = j(
  class extends v(
    document.createElement(g).constructor,
    {},
    ...q(E)
  ) {
    #t = {};
    constructor() {
      super(), this.classes.add("nav-link"), this.attribute.webComponent = !0, this.on.click = async (i) => {
        if (this.path) {
          i.preventDefault();
          const t = this.closest(".nav");
          if (t)
            for (const e of t.querySelectorAll("a.nav-link"))
              e.classList.remove("active");
          this.classes.add("active");
          const s = this.#t.query ? this.path + y.stringify(this.#t.query) : this.path;
          await b(s);
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
  },
  "nav-link",
  g
);
export {
  R as NavLink,
  y as Query,
  n as Router,
  b as router
};

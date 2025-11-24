const d = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([r, s]) => {
          if (s = s.trim(), s === "") return [r, !0];
          const n = Number(s);
          return [r, Number.isNaN(n) ? s : n];
        })
      )
    );
  }
  stringify() {
  }
}();
class u {
  static create = (...t) => new u(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [e, r] of Object.entries(t))
      this.#t.registry.set(e, r);
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
const { reactive: L, ref: m } = await use("@/state.js"), { Exception: $ } = await use("@/tools/exception.js");
class c {
  static create = (...t) => new c(...t);
  #t = {};
  constructor(t) {
    this.#t.path = m({ owner: t, name: "path" }), this.#t.effects = new Proxy(this, {
      get(e, r) {
        return $.if(!(r in e), `Invalid key: ${r}.`), e[r].effects;
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
class l {
  static create = (...t) => new l(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const r = e.search;
    this.#t.hash = e.hash, this.#t.query = d.parse(r), this.#t.full = r ? `${this.path}${r}${this.hash}` : `${this.path}${this.hash}`;
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
const { app: g } = await use("@/app/"), a = new class {
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
    this.#t.routes = new u(), this.#t.states = new c(this);
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
  async setup({ error: t, strict: e = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = e, this.#t.initialized || (window.addEventListener("popstate", async (r) => {
      await this.use(this.#e(), {
        context: "pop"
      });
    }), await this.use(this.#e(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: e, strict: r } = {}) {
    r = r === void 0 ? this.#t.config.strict : r;
    const s = l.create(t), n = this.url ? s.match(this.url) ? void 0 : (this.#t.url = s, () => {
      e || history.pushState({}, "", s.full);
    }) : (this.#t.url = s, () => {
      e || history.pushState({}, "", s.full);
    });
    if (!n)
      return this;
    const h = await (async () => {
      const { path: f, residual: p, route: o } = await this.#s(s.path) || {};
      if (o)
        return async () => {
          g.$({ path: f }), this.#t.states.path(f, {}, s.query), o === this.route ? await o({ update: !0 }, s.query, ...p) : (this.route && await this.route({ exit: !0 }), await o({ enter: !0 }, s.query, ...p), this.#t.route = o);
        };
    })();
    return h ? (this.#t.session++, n(), await h(), this) : (r && (this.#t.config.error || (this.#t.config.error = (await use("/pages/error.js")).default), this.#t.session++, n(), this.#t.route = null, g.$({ path: s.path }), this.#t.states.path(s.path, {}, s.query), await this.#t.config.error(s.path)), this);
  }
  async #s(t) {
    const e = t.slice(1).split("/");
    for (let r = e.length - 1; r >= 0; r--) {
      const s = `/${e.slice(0, r + 1).join("/")}`;
      if (this.routes.has(s)) {
        const n = e.slice(r + 1), h = this.routes.get(s);
        return { path: s, route: h, residual: n };
      }
    }
    for (const r of ["/", "@/", "@@/"])
      try {
        const s = (await use(`${r}pages${t}.x.html`))();
        return { path: t, route: s, residual: [] };
      } catch (s) {
        if (s.name !== "UseError")
          throw s;
      }
  }
  #e() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: w } = await use("@/tools/exception.js"), v = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return a;
    w.if(!(t in a), `Invalid key: ${t}`);
    const e = a[t];
    return typeof e == "function" ? e.bind(a) : e;
  },
  set(i, t, e) {
    return w.if(!(t in a), `Invalid key: ${t}`), a[t] = e, !0;
  },
  apply(i, t, e) {
    return a.use(...e);
  },
  deleteProperty(i, t) {
    a.routes.remove(t);
  },
  has(i, t) {
    return a.routes.has(t);
  }
}), { Mixins: b, author: j, mix: q } = await use("@/component.js"), { stateMixin: E } = await use("@/state.js"), y = "a", R = j(
  class extends q(
    document.createElement(y).constructor,
    {},
    ...b(E)
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
          this.classes.add("active"), await v(this.path);
        }
      };
    }
    get path() {
      return this.attribute.path;
    }
    set path(i) {
      this.attribute.path = i;
    }
  },
  "nav-link",
  y
);
export {
  R as NavLink,
  d as Query,
  a as Router,
  v as router
};

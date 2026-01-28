class m {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(...t) {
    const s = t.at(0), e = t.at(1);
    return t.at(2), this.#t.registry.set(s, { route: e }), this;
  }
  async get(t) {
    const s = this.#t.registry.get(t), e = s.route;
    if (!s.setup) {
      const r = e.page;
      r instanceof HTMLElement && r.attribute && (r.attribute.page = t), typeof e.setup == "function" && await e.setup(t), s.setup = !0;
    }
    return e;
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
    const s = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(s), ([e, r]) => {
          if (r = r.trim(), r === "") return [e, !0];
          if (r === "true") return [e, !0];
          const n = Number(r);
          return [e, Number.isNaN(n) ? r : n];
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
}(), { is: l } = await use("@/rollo/"), b = (i, t) => {
  if (!l.object(i) || !l.object(t) || Object.keys(i).length !== Object.keys(t).length)
    return !1;
  for (const [s, e] of Object.entries(i))
    if (t[s] !== e)
      return !1;
  return !0;
};
class f {
  static create = (...t) => new f(...t);
  #t = {};
  constructor(t) {
    const s = new URL(t, location.origin);
    this.#t.path = s.pathname;
    const e = s.search;
    this.#t.hash = s.hash, this.#t.query = d.parse(e), this.#t.full = e ? `${this.path}${e}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && b(t.query, this.query);
  }
}
const { Exception: p, ref: $ } = await use("@/rollo/"), a = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new m(), this.#t.states = {
      path: $({ owner: this, name: "path" })
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
  async setup({ error: t, redirect: s, routes: e, strict: r = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = r, Object.assign(this.#t.config.redirect, s), e && this.routes.add({ ...e }), this.#t.initialized || (window.parent.addEventListener("popstate", async (n) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: s, strict: e } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), e = e === void 0 ? this.#t.config.strict : e;
    const r = f.create(t), n = (() => {
      const h = window.parent.history;
      return this.#t.url ? r.match(this.#t.url) ? void 0 : (this.#t.url = r, () => {
        s || h.pushState({}, "", r.full);
      }) : (this.#t.url = r, () => {
        s || h.pushState({}, "", r.full);
      });
    })();
    if (!n)
      return this;
    this.#t.session++;
    const u = await (async () => {
      const { path: h, residual: c, route: o } = await this.#r(r.path) || {};
      if (!o) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(h, r.query, ...c), o === this.#t.route ? o.update && await o.update(
          { session: this.#t.session },
          r.query,
          ...c
        ) : (this.#t.route && this.#t.route.exit && await this.#t.route.exit({ session: this.#t.session }), o.enter && await o.enter(
          { session: this.#t.session },
          r.query,
          ...c
        ), this.#t.route = o);
      };
    })();
    if (!u) {
      if (n(), this.#e(r.path, r.query), e) {
        const h = `Invalid path: ${r.path}`;
        if (this.#t.config.error)
          this.#t.config.error(h);
        else
          throw new Error(h);
      }
      return this;
    }
    return n(), await u(), this;
  }
  async #r(t) {
    const s = t.slice(1).split("/");
    for (let e = s.length - 1; e >= 0; e--) {
      const r = `/${s.slice(0, e + 1).join("/")}`;
      if (this.routes.has(r)) {
        const n = s.slice(e + 1), u = await this.routes.get(r);
        return { path: r, route: u, residual: n };
      }
    }
  }
  /* Enables external hooks etc. */
  #e(t, s, ...e) {
    e.length && (t = `${t}/${e.join("/")}`), app.$({ path: t }), this.#t.states.path(t, {}, s, ...e);
  }
  #s() {
    const t = window.parent.location;
    return t.search ? `${t.pathname}${t.search}${t.hash}` : `${t.pathname}${t.hash}`;
  }
}(), y = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return a;
    p.if(!(t in a), `Invalid key: ${t}`);
    const s = a[t];
    return typeof s == "function" ? s.bind(a) : s;
  },
  set(i, t, s) {
    return p.if(!(t in a), `Invalid key: ${t}`), a[t] = s, !0;
  },
  apply(i, t, s) {
    return a.use(...s);
  },
  deleteProperty(i, t) {
    a.routes.remove(t);
  },
  has(i, t) {
    return a.routes.has(t);
  }
});
class w {
  static create = (...t) => new w(...t);
  #t = {};
  constructor({ enter: t, exit: s, page: e, path: r, setup: n, update: u } = {}) {
    t && (this.#t.enter = t), s ? this.#t.exit = s : this.#t.exit = (h) => this.page.remove(), e && (this.#t.page = e), r && (this.#t.path = r), n && (this.#t.setup = n), u && (this.#t.update = u);
  }
  get page() {
    return this.#t.page;
  }
  get path() {
    return this.#t.path;
  }
  async setup(t) {
    if (this.#t.setup)
      return await this.#t.setup(t);
  }
  async enter(t, s, ...e) {
    if (this.#t.enter)
      return await this.#t.enter(t, s, ...e);
  }
  async update(t, s, ...e) {
    if (this.#t.update)
      return await this.#t.update(t, s, ...e);
  }
  async exit(t) {
    return await this.#t.exit(t);
  }
}
const { Mixins: q, author: x, mix: j, stateMixin: v } = await use("@/rollo/"), g = "a", E = x(
  class extends j(
    document.createElement(g).constructor,
    {},
    ...q(v)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (i) => {
        if (this.path) {
          i.preventDefault();
          const t = this.#t.query ? this.path + d.stringify(this.#t.query) : this.path;
          await y(t);
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
  g
), L = (i) => (y.effects.add(
  (t) => {
    const s = i.find(".active");
    s && s.classes.remove("active");
    const e = i.find(`[path="${t}"]`);
    e && e.classes.add("active");
  },
  (t) => !!t
), i);
export {
  L as Nav,
  E as NavLink,
  w as Route,
  y as router
};

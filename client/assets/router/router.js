const { Exception: l } = await use("@/tools/exception"), { type: w } = await use("@/tools/type"), m = Object.freeze(
  /* @__PURE__ */ new Set(["AsyncFunction", "Function", "Module", "Object"])
);
class b {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [e, s] of Object.entries(t)) {
      const i = w(s);
      l.if(!m.has(i), `Invalid route type: ${i}`), l.if(
        (i === "Module" || i === "Object") && s.default && typeof s.default != "function",
        `Invalid default member (expected a function; got type: ${i})`,
        () => console.error("default:", s.default)
      ), this.#t.registry.set(e, { route: s });
    }
  }
  async get(t) {
    const e = this.#t.registry.get(t);
    return typeof e.route == "function" ? e.route : (!e.setup && typeof e.route.setup == "function" && (e.setup = !0, await e.route.setup(t)), typeof e.route.default == "function" && (e.route = await e.route.default()), e.route);
  }
  has(t) {
    return this.#t.registry.has(t);
  }
  remove(t) {
    return this.#t.registry.delete(t);
  }
}
const y = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([s, i]) => {
          if (i = i.trim(), i === "") return [s, !0];
          if (i === "true") return [s, !0];
          const o = Number(i);
          return [s, Number.isNaN(o) ? i : o];
        }).filter(([s, i]) => !["false", "null", "undefined"].includes(i))
      )
    );
  }
  stringify(t) {
    return t = Object.fromEntries(
      Object.entries(t).filter(
        ([e, s]) => ![!1, null, void 0].includes(s)
      )
    ), "?" + new URLSearchParams(t).toString().replaceAll("=true", "");
  }
}(), { match: $ } = await use("@/tools/object/match");
class f {
  static create = (...t) => new f(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = y.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && $(t.query, this.query);
  }
}
const { app: x } = await use("@/app/"), { ref: q } = await use("@/state"), a = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new b(), this.#t.states = {
      path: q({ owner: this, name: "path" })
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
  async setup({ error: t, redirect: e, routes: s, strict: i = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = i, Object.assign(this.#t.config.redirect, e), s && this.routes.add({ ...s }), this.#t.initialized || (window.addEventListener("popstate", async (o) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: e, strict: s } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), s = s === void 0 ? this.#t.config.strict : s;
    const i = f.create(t), o = this.#t.url ? i.match(this.#t.url) ? void 0 : (this.#t.url = i, () => {
      e || history.pushState({}, "", i.full);
    }) : (this.#t.url = i, () => {
      e || history.pushState({}, "", i.full);
    });
    if (!o)
      return this;
    this.#t.session++;
    const h = await (async () => {
      const { path: c, residual: u, route: n } = await this.#i(i.path) || {};
      if (!n) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(c, i.query, ...u), n === this.#t.route ? n.update ? await n.update(
          { session: this.#t.session },
          i.query,
          ...u
        ) : typeof n == "function" && await n(
          { mode: "update", session: this.#t.session, update: !0 },
          i.query,
          ...u
        ) : (this.#t.route && (this.#t.route.exit ? await this.#t.route.exit({ session: this.#t.session }) : typeof this.#t.route == "function" && await this.#t.route({
          exit: !0,
          mode: "exit",
          session: this.#t.session
        })), n.enter ? await n.enter(
          { session: this.#t.session },
          i.query,
          ...u
        ) : typeof n == "function" && await n(
          { enter: !0, mode: "enter", session: this.#t.session },
          i.query,
          ...u
        ), this.#t.route = n);
      };
    })();
    if (!h) {
      if (o(), this.#e(i.path, i.query), s) {
        const c = `Invalid path: ${i.path}`;
        if (this.#t.config.error)
          this.#t.config.error(c);
        else
          throw new Error(c);
      }
      return this;
    }
    return o(), await h(), this;
  }
  async #i(t) {
    const e = t.slice(1).split("/");
    for (let s = e.length - 1; s >= 0; s--) {
      const i = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(i)) {
        const o = e.slice(s + 1), h = await this.routes.get(i);
        return { path: i, route: h, residual: o };
      }
    }
  }
  /* Enables external hooks etc. */
  #e(t, e, ...s) {
    s.length && (t = `${t}/${s.join("/")}`), x.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: p } = await use("@/tools/exception"), g = new Proxy(async () => {
}, {
  get(r, t) {
    if (t === "router")
      return a;
    p.if(!(t in a), `Invalid key: ${t}`);
    const e = a[t];
    return typeof e == "function" ? e.bind(a) : e;
  },
  set(r, t, e) {
    return p.if(!(t in a), `Invalid key: ${t}`), a[t] = e, !0;
  },
  apply(r, t, e) {
    return a.use(...e);
  },
  deleteProperty(r, t) {
    a.routes.remove(t);
  },
  has(r, t) {
    return a.routes.has(t);
  }
}), R = (r) => (g.effects.add(
  (t) => {
    const e = r.find(".active");
    e && e.classes.remove("active");
    const s = r.find(`[path="${t}"]`);
    s && s.classes.add("active");
  },
  (t) => !!t
), r), { Mixins: j, author: v, mix: O } = await use("@/component"), { stateMixin: E } = await use("@/state"), d = "a", L = v(
  class extends O(
    document.createElement(d).constructor,
    {},
    ...j(E)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (r) => {
        if (this.path) {
          r.preventDefault();
          const t = this.#t.query ? this.path + y.stringify(this.#t.query) : this.path;
          await g(t);
        }
      };
    }
    get path() {
      return this.attribute.path;
    }
    set path(r) {
      this.attribute.path = r;
    }
    get query() {
      if (this.#t.query)
        return Object.freeze({ ...this.#t.query });
    }
    set query(r) {
      this.#t.query = r;
    }
    get selected() {
      return this.attribute.selected || !1;
    }
    set selected(r) {
      this.attribute.selected = r;
    }
  },
  "nav-link",
  d
);
export {
  R as Nav,
  L as NavLink,
  y as Query,
  a as Router,
  b as Routes,
  f as Url,
  g as router
};

class c {
  static create = (...t) => new c(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(t) {
    for (const [e, s] of Object.entries(t))
      this.#t.registry.set(e, s);
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
const g = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([s, r]) => {
          if (r = r.trim(), r === "") return [s, !0];
          if (r === "true") return [s, !0];
          const i = Number(r);
          return [s, Number.isNaN(i) ? r : i];
        }).filter(([s, r]) => !["false", "null", "undefined"].includes(r))
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
}(), { match: m } = await use("@/tools/object/match");
class l {
  static create = (...t) => new l(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = g.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && m(t.query, this.query);
  }
}
const { app: b } = await use("@/app/"), { ref: $ } = await use("@/state"), o = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new c(), this.#t.states = {
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
  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ auto: t = !0, error: e, redirect: s, routes: r, strict: i = !0 } = {}) {
    return this.#t.config.auto = t, this.#t.config.error = e, this.#t.config.strict = i, Object.assign(this.#t.config.redirect, s), r && this.routes.add({ ...r }), this.#t.initialized || (window.addEventListener("popstate", async (h) => {
      await this.use(this.#s(), {
        context: "pop"
      });
    }), await this.use(this.#s(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { auto: e, context: s, strict: r } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), e = e === void 0 ? this.#t.config.auto : e, r = r === void 0 ? this.#t.config.strict : r;
    const i = l.create(t), h = this.#t.url ? i.match(this.#t.url) ? void 0 : (this.#t.url = i, () => {
      s || history.pushState({}, "", i.full);
    }) : (this.#t.url = i, () => {
      s || history.pushState({}, "", i.full);
    });
    if (!h)
      return this;
    this.#t.session++;
    const f = await (async () => {
      const { path: w, residual: u, route: a } = await this.#r(i.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(w, i.query, ...u), a === this.#t.route ? a.update ? await a.update(
          { session: this.#t.session },
          i.query,
          ...u
        ) : await a(
          { mode: "update", session: this.#t.session, update: !0 },
          i.query,
          ...u
        ) : (this.#t.route && (this.#t.route.exit ? await this.#t.route.exit({ session: this.#t.session }) : await this.#t.route({
          exit: !0,
          mode: "exit",
          session: this.#t.session
        })), a.enter ? await a.enter(
          { session: this.#t.session },
          i.query,
          ...u
        ) : await a(
          { enter: !0, mode: "enter", session: this.#t.session },
          i.query,
          ...u
        ), this.#t.route = a);
      };
    })();
    return f ? (h(), await f(), this) : (h(), this.#e(i.path, i.query), r && (this.#t.config.error || (this.#t.config.error = (await use("/pages/error.js")).default), await this.#t.config.error(i.path)), this);
  }
  async #r(t) {
    const e = t.slice(1).split("/");
    for (let s = e.length - 1; s >= 0; s--) {
      const r = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(r)) {
        const i = e.slice(s + 1), h = this.routes.get(r);
        return { path: r, route: h, residual: i };
      }
    }
    if (this.#t.config.auto)
      for (const s of ["/", "@/", "@@/"])
        try {
          const r = (await use(`${s}pages${t}.x.html`))();
          return { path: t, route: r, residual: [] };
        } catch (r) {
          if (r.name !== "UseError")
            throw r;
        }
  }
  /* Enables external hooks etc. */
  #e(t, e, ...s) {
    b.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: p } = await use("@/tools/exception"), y = new Proxy(async () => {
}, {
  get(n, t) {
    if (t === "router")
      return o;
    p.if(!(t in o), `Invalid key: ${t}`);
    const e = o[t];
    return typeof e == "function" ? e.bind(o) : e;
  },
  set(n, t, e) {
    return p.if(!(t in o), `Invalid key: ${t}`), o[t] = e, !0;
  },
  apply(n, t, e) {
    return o.use(...e);
  },
  deleteProperty(n, t) {
    o.routes.remove(t);
  },
  has(n, t) {
    return o.routes.has(t);
  }
}), L = (n) => (y.effects.add(
  (t) => {
    const e = n.find("[selected]");
    e && (e.selected = !1);
    const s = n.find(`[path="${t}"]`);
    s && (s.selected = !0);
  },
  (t) => !!t
), n), { Mixins: q, author: x, mix: j } = await use("@/component"), { stateMixin: O } = await use("@/state"), d = "a", N = x(
  class extends j(
    document.createElement(d).constructor,
    {},
    ...q(O)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (n) => {
        if (this.path) {
          n.preventDefault();
          const t = this.#t.query ? this.path + g.stringify(this.#t.query) : this.path;
          await y(t);
        }
      };
    }
    get path() {
      return this.attribute.path;
    }
    set path(n) {
      this.attribute.path = n;
    }
    get query() {
      if (this.#t.query)
        return Object.freeze({ ...this.#t.query });
    }
    set query(n) {
      this.#t.query = n;
    }
    get selected() {
      return this.attribute.selected || !1;
    }
    set selected(n) {
      this.attribute.selected = n;
    }
  },
  "nav-link",
  d
);
export {
  L as Nav,
  N as NavLink,
  g as Query,
  o as Router,
  l as Url,
  y as router
};

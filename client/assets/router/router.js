class l {
  static create = (...t) => new l(...t);
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
const m = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([s, r]) => {
          if (r = r.trim(), r === "") return [s, !0];
          if (r === "true") return [s, !0];
          const n = Number(r);
          return [s, Number.isNaN(n) ? r : n];
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
}(), { match: j } = await use("@/tools/object/match");
class f {
  static create = (...t) => new f(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = m.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && j(t.query, this.query);
  }
}
const { component: c } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: E } = await use("@/state"), b = E(), $ = c.main(
  "container",
  c.h1({ text: "Page not found" })
), g = c.p({ parent: $ });
b.effects.add((i) => {
  i ? g.text = `Invalid path: ${i}.` : g.clear();
});
const O = (i) => {
  d.clear(":not([slot])"), d.append($), b(i);
}, { app: v } = await use("@/app/"), { ref: z } = await use("@/state"), o = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new l(), this.#t.states = {
      path: z({ owner: this, name: "path" })
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
  error(...t) {
    return this.#t.config.error(...t);
  }
  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ auto: t = !0, error: e = O, redirect: s, routes: r, strict: n = !0 } = {}) {
    return this.#t.config.auto = t, this.#t.config.error = e, this.#t.config.strict = n, Object.assign(this.#t.config.redirect, s), r && this.routes.add({ ...r }), this.#t.initialized || (window.addEventListener("popstate", async (u) => {
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
    const n = f.create(t), u = this.#t.url ? n.match(this.#t.url) ? void 0 : (this.#t.url = n, () => {
      s || history.pushState({}, "", n.full);
    }) : (this.#t.url = n, () => {
      s || history.pushState({}, "", n.full);
    });
    if (!u)
      return this;
    this.#t.session++;
    const p = await (async () => {
      const { path: q, residual: h, route: a } = await this.#r(n.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(q, n.query, ...h), a === this.#t.route ? a.update ? await a.update(
          { session: this.#t.session },
          n.query,
          ...h
        ) : await a(
          { mode: "update", session: this.#t.session, update: !0 },
          n.query,
          ...h
        ) : (this.#t.route && (this.#t.route.exit ? await this.#t.route.exit({ session: this.#t.session }) : await this.#t.route({
          exit: !0,
          mode: "exit",
          session: this.#t.session
        })), a.enter ? await a.enter(
          { session: this.#t.session },
          n.query,
          ...h
        ) : await a(
          { enter: !0, mode: "enter", session: this.#t.session },
          n.query,
          ...h
        ), this.#t.route = a);
      };
    })();
    return p ? (u(), await p(), this) : (u(), this.#e(n.path, n.query), r && this.#t.config.error(n.path), this);
  }
  async #r(t) {
    const e = t.slice(1).split("/");
    for (let s = e.length - 1; s >= 0; s--) {
      const r = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(r)) {
        const n = e.slice(s + 1), u = this.routes.get(r);
        return { path: r, route: u, residual: n };
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
    v.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: y } = await use("@/tools/exception"), x = new Proxy(async () => {
}, {
  get(i, t) {
    if (t === "router")
      return o;
    y.if(!(t in o), `Invalid key: ${t}`);
    const e = o[t];
    return typeof e == "function" ? e.bind(o) : e;
  },
  set(i, t, e) {
    return y.if(!(t in o), `Invalid key: ${t}`), o[t] = e, !0;
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
}), A = (i) => (x.effects.add(
  (t) => {
    const e = i.find("[selected]");
    e && (e.selected = !1);
    const s = i.find(`[path="${t}"]`);
    s && (s.selected = !0);
  },
  (t) => !!t
), i), { Mixins: L, author: N, mix: R } = await use("@/component"), { stateMixin: _ } = await use("@/state"), w = "a", U = N(
  class extends R(
    document.createElement(w).constructor,
    {},
    ...L(_)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (i) => {
        if (this.path) {
          i.preventDefault();
          const t = this.#t.query ? this.path + m.stringify(this.#t.query) : this.path;
          await x(t);
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
  A as Nav,
  U as NavLink,
  m as Query,
  o as Router,
  f as Url,
  x as router
};

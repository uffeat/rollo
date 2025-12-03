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
    for (const [e, s] of Object.entries(t)) {
      const i = j(s);
      p.if(!O.has(i), `Invalid route type: ${i}`), p.if(
        (i === "Module" || i === "Object") && s.default && typeof s.default != "function",
        `Invalid default member (expected a function; got type: ${i})`,
        () => console.error("default:", s.default)
      ), this.#t.registry.set(e, { route: s });
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
        Array.from(new URLSearchParams(e), ([s, i]) => {
          if (i = i.trim(), i === "") return [s, !0];
          if (i === "true") return [s, !0];
          const n = Number(i);
          return [s, Number.isNaN(n) ? i : n];
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
}(), { match: v } = await use("@/tools/object/match");
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
    return t.path === this.path && t.hash === this.hash && v(t.query, this.query);
  }
}
const { component: c } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: E } = await use("@/state"), b = E(), $ = c.main(
  "container",
  c.h1({ text: "Page not found" })
), y = c.p({ parent: $ });
b.effects.add((r) => {
  r ? y.text = `Invalid path: ${r}.` : y.clear();
});
const _ = (r) => {
  d.clear(":not([slot])"), d.append($), b(r);
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
  async setup({ error: t = _, redirect: e, routes: s, strict: i = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = i, Object.assign(this.#t.config.redirect, e), s && this.routes.add({ ...s }), this.#t.initialized || (window.addEventListener("popstate", async (n) => {
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
    const i = f.create(t), n = this.#t.url ? i.match(this.#t.url) ? void 0 : (this.#t.url = i, () => {
      e || history.pushState({}, "", i.full);
    }) : (this.#t.url = i, () => {
      e || history.pushState({}, "", i.full);
    });
    if (!n)
      return this;
    this.#t.session++;
    const h = await (async () => {
      const { path: q, residual: u, route: a } = await this.#i(i.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#e(q, i.query, ...u), a === this.#t.route ? a.update ? await a.update(
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
    return h ? (n(), await h(), this) : (n(), this.#e(i.path, i.query), s && this.#t.config.error(i.path), this);
  }
  async #i(t) {
    const e = t.slice(1).split("/");
    for (let s = e.length - 1; s >= 0; s--) {
      const i = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(i)) {
        const n = e.slice(s + 1), h = await this.routes.get(i);
        return { path: i, route: h, residual: n };
      }
    }
  }
  /* Enables external hooks etc. */
  #e(t, e, ...s) {
    s.length && (t = `${t}/${s.join("/")}`), z.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #s() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), { Exception: g } = await use("@/tools/exception"), x = new Proxy(async () => {
}, {
  get(r, t) {
    if (t === "router")
      return o;
    g.if(!(t in o), `Invalid key: ${t}`);
    const e = o[t];
    return typeof e == "function" ? e.bind(o) : e;
  },
  set(r, t, e) {
    return g.if(!(t in o), `Invalid key: ${t}`), o[t] = e, !0;
  },
  apply(r, t, e) {
    return o.use(...e);
  },
  deleteProperty(r, t) {
    o.routes.remove(t);
  },
  has(r, t) {
    return o.routes.has(t);
  }
}), P = (r) => (x.effects.add(
  (t) => {
    const e = r.find("[selected]");
    e && (e.selected = !1);
    const s = r.find(`[path="${t}"]`);
    s && (s.selected = !0);
  },
  (t) => !!t
), r), { Mixins: N, author: R, mix: S } = await use("@/component"), { stateMixin: A } = await use("@/state"), w = "a", F = R(
  class extends S(
    document.createElement(w).constructor,
    {},
    ...N(A)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (r) => {
        if (this.path) {
          r.preventDefault();
          const t = this.#t.query ? this.path + m.stringify(this.#t.query) : this.path;
          await x(t);
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
  w
);
export {
  P as Nav,
  F as NavLink,
  m as Query,
  o as Router,
  l as Routes,
  f as Url,
  x as router
};

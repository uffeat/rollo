class p extends Error {
  static raise = (e, t) => {
    throw t?.(), new p(e);
  };
  static if = (e, t, i) => {
    typeof e == "function" && (e = e()), e && p.raise(t, i);
  };
  constructor(e) {
    super(e), this.name = "UseError";
  }
}
const D = {}, m = "https://rolloh.vercel.app", R = new class {
  #e = {};
  constructor() {
    const a = "https://rollohdev.anvil.app", e = "https://rolloh.anvil.app";
    this.#e.origin = location.origin === m || location.origin === e ? e : a, this.#e.PROD = this.#e.origin === e, this.#e.DEV = !this.#e.PROD, this.#e.env = this.#e.PROD ? "production" : "development";
  }
  get DEV() {
    return this.#e.DEV;
  }
  get PROD() {
    return this.#e.PROD;
  }
  get env() {
    return this.#e.env;
  }
  get origin() {
    return this.#e.origin;
  }
  get targets() {
    return this.#e.targets;
  }
  set targets(a) {
    this.#e.targets = a;
  }
}(), L = new class {
  #e = {
    detail: {}
  };
  constructor() {
    const a = "3869";
    this.#e.PROD = location.origin === m, this.#e.DEV = !this.#e.PROD, this.#e.ANVIL = R.origin === location.origin, this.#e.VITE = typeof import.meta < "u" && typeof D < "u" && "production", this.#e.base = this.#e.ANVIL ? m : this.#e.DEV && location.port !== a ? `http://localhost:${a}` : location.origin !== m ? m : "", this.#e.env = this.#e.PROD ? "production" : "development";
  }
  get ANVIL() {
    return this.#e.ANVIL;
  }
  /* Returns production origin */
  get BASE() {
    return m;
  }
  get DEV() {
    return this.#e.DEV;
  }
  get PROD() {
    return this.#e.PROD;
  }
  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return this.#e.VITE;
  }
  get base() {
    return this.#e.base;
  }
  get detail() {
    return this.#e.detail;
  }
  get env() {
    return this.#e.env;
  }
  get server() {
    return R;
  }
}();
class y {
  static create = (e) => e instanceof y ? e : new y(e);
  #e = {
    detail: {}
  };
  constructor(e) {
    this.#e.specifier = e;
    const [t, i] = e.split("?");
    i ? this.#e.query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(i), ([n, o]) => {
          if (o = o.trim(), o === "") return [n, !0];
          if (o === "true") return [n, !0];
          const u = Number(o);
          return [n, Number.isNaN(u) ? o : u];
        }).filter(([n, o]) => !["false", "null", "undefined"].includes(o))
      )
    ) : this.#e.query = null;
    let r = t.split("/");
    if (this.#e.source = r.shift(), r.at(-1) === "" && (r[r.length - 1] = `${r[r.length - 2]}.js`), r.includes("")) {
      const n = r.findIndex((u) => u === ""), o = r[n + 1];
      r[n] = o.split(".")[0];
    }
    const s = r.at(-1);
    if (s && !s.includes(".") && (r[r.length - 1] = `${s}.js`), this.#e.parts = Object.freeze(r), this.#e.path = `/${r.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = r.at(-1), this.#e.file) {
      this.#e.stem = this.#e.file.split(".").at(0), this.#e.type = this.#e.file.split(".").at(-1);
      const [n, ...o] = this.#e.file.split(".");
      this.#e.types = o.join(".");
    }
  }
  /* Returns detail for ad-hoc data.
  NOTE Can be critical for handlers. */
  get detail() {
    return this.#e.detail;
  }
  /* Returns file name with types(s). */
  get file() {
    return this.#e.file;
  }
  /* Returns full path (incl. source). */
  get full() {
    return this.#e.full;
  }
  /* Returns array of dir/file parts (source excluded). */
  get parts() {
    return this.#e.parts;
  }
  /* Returns path (source excluded, but always starting with '/'). */
  get path() {
    return this.#e.path;
  }
  /* Returns query. */
  get query() {
    return this.#e.query;
  }
  /* Returns source. */
  get source() {
    return this.#e.source || "/";
  }
  /* Returns specifier. */
  get specifier() {
    return this.#e.specifier;
  }
  /* Returns file stem. */
  get stem() {
    return this.#e.stem;
  }
  /* Returns declared file type. */
  get type() {
    return this.#e.type;
  }
  /* Sets file type.
  NOTE Intended for special use by handlers. */
  set type(e) {
    this.#e.type = e;
  }
  /* Returns string with pseudo files types and declared file type. */
  get types() {
    return this.#e.types;
  }
  /* Sets file types.
  NOTE Intended for special use by handlers. */
  set types(e) {
    this.#e.types = e;
  }
}
class w {
  #e = {
    detail: {}
  };
  constructor(e, t) {
    this.#e.owner = e, this.#e.registry = t || /* @__PURE__ */ new Map();
  }
  get detail() {
    return this.#e.detail;
  }
  get owner() {
    return this.#e.owner;
  }
  get size() {
    return this.#e.registry.size;
  }
  add(e, t) {
    return this.#e.registry.set(e, t), this.owner;
  }
  get(e) {
    return this.#e.registry.get(e);
  }
  has(e) {
    return this.#e.registry.has(e);
  }
  keys() {
    return this.#e.registry.keys();
  }
}
const O = (a) => Object.prototype.toString.call(a).slice(8, -1), d = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = L, this.#e.sources = new w(this), this.#e.processors = new class extends w {
      #t = {};
      constructor(t) {
        const i = /* @__PURE__ */ new Map();
        super(t, i), this.#t.registry = i;
      }
      add(...t) {
        const i = t.pop();
        for (const r of t)
          this.#t.registry.set(r, i);
        return this.owner;
      }
    }(this), this.#e.types = new w(this);
  }
  /* . */
  get anvil() {
    return this.#e.anvil;
  }
  /* . */
  set anvil(e) {
    this.#e.anvil = e;
  }
  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#e.detail;
  }
  /* Returns meta. */
  get meta() {
    return this.#e.meta;
  }
  /* Returns processors controller. */
  get processors() {
    return this.#e.processors;
  }
  /* Returns sources controller. */
  get sources() {
    return this.#e.sources;
  }
  /* Returns types controller. */
  get types() {
    return this.#e.types;
  }
  /* Injects asset. 
  NOTE Inteded for overloading when testing parcels. */
  add(e, t) {
    return this.#e.added.set(e, t), this;
  }
  /* Defines getter. */
  compose(e, t) {
    return Object.defineProperty(this, e, {
      configurable: !0,
      enumerable: !1,
      get() {
        return t;
      }
    }), this;
  }
  /* Returns and processes asset. */
  async get(e, ...t) {
    const i = t.find((n, o) => !o && O(n) === "Object") || {};
    t = t.filter((n, o) => o && n !== i);
    const r = y.create(e);
    let s;
    if (this.#e.added.has(r.full) ? (s = this.#e.added.get(r.full), typeof s == "function" && (s = await s({ path: r }))) : (this.sources.has(r.source) || p.raise(`Invalid source: ${r.source}`), s = await this.sources.get(r.source)(
      { options: { ...i }, owner: this, path: r },
      ...t
    )), r.detail.escape || s instanceof Error) return s;
    if (i.raw)
      return i.spec ? Object.freeze({
        path: r.full,
        source: r.source,
        text: s,
        type: r.type
      }) : s;
    if (r.detail.transform !== !1 && this.types.has(r.type)) {
      const o = await this.types.get(r.type)(
        s,
        { options: { ...i }, owner: this, path: r },
        ...t
      );
      o != null && (s = o);
    }
    if (r.detail.process !== !1 && this.processors.has(r.types)) {
      const o = await this.processors.get(r.types)(
        s,
        { options: { ...i }, owner: this, path: r },
        ...t
      );
      o != null && (s = o);
    }
    return s;
  }
  /* Returns module (native 'import' function) */
  async import(e) {
    return this.#e.import(e);
  }
  /* Returns uncached constructed module. */
  // NOTE Provided as a service to handlers.
  async module(e, t) {
    t && (e = `${e}
//# sourceURL=${t}`);
    const i = URL.createObjectURL(
      new Blob([e], { type: "text/javascript" })
    ), r = await this.import(i);
    return URL.revokeObjectURL(i), r;
  }
}(), l = new Proxy(async () => {
}, {
  get(a, e) {
    if (e === "assets")
      return d;
    const t = d[e];
    return typeof t == "function" ? t.bind(d) : t;
  },
  set(a, e, t) {
    return d[e] = t, !0;
  },
  apply(a, e, t) {
    return d.get(...t);
  }
});
Object.defineProperty(globalThis, "use", {
  configurable: d.meta.DEV,
  enumerable: !0,
  writable: d.meta.DEV,
  value: l
});
window.dispatchEvent(new CustomEvent("_use"));
const b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
l.sources.add("/", async ({ options: a, owner: e, path: t }) => {
  const { as: i, raw: r } = a;
  if (t.type === "css" && i === void 0 && r !== !0) {
    l.meta.DEV && await l(t.path, { raw: !0 });
    const s = `${e.meta.base}${t.path}`;
    let n = document.head.querySelector(
      `link[rel="stylesheet"][href="${s}"]`
    );
    if (n)
      return h.has(s) ? h.get(s) : n;
    n = document.createElement("link"), n.rel = "stylesheet", n.href = s;
    const { promise: o, resolve: u, reject: c } = Promise.withResolvers();
    return h.set(s, o), n.addEventListener(
      "load",
      (f) => {
        u(n), h.delete(s);
      },
      { once: !0 }
    ), n.addEventListener(
      "error",
      (f) => {
        h.delete(s), c(new p(`Failed to load sheet: ${s}`));
      },
      { once: !0 }
    ), document.head.append(n), await o;
  }
  if (t.type === "js" && r !== !0) {
    if (i === "script") {
      const s = `${e.meta.base}${t.path}`;
      let n = document.head.querySelector(`script[src="${s}"]`);
      if (n)
        return h.has(s) ? h.get(s) : !0;
      n = document.createElement("script"), n.src = s;
      const { promise: o, resolve: u, reject: c } = Promise.withResolvers();
      return h.set(s, o), n.addEventListener(
        "load",
        (f) => {
          h.delete(s), u(!0);
        },
        { once: !0 }
      ), n.addEventListener(
        "error",
        (f) => {
          h.delete(s), c(new p(`Failed to load script: ${s}`));
        },
        { once: !0 }
      ), document.head.append(n), await o;
    }
    if (i === void 0)
      return await e.import(`${e.meta.base}${t.path}`);
  }
  if (b.has(t.full))
    return b.get(t.full);
  if (h.has(t.full)) {
    const n = await h.get(t.full);
    return h.delete(t.full), n;
  } else {
    const { promise: s, resolve: n, reject: o } = Promise.withResolvers();
    h.set(t.full, s);
    try {
      const u = (await (await fetch(`${e.meta.base}${t.path}`, {
        cache: "no-store"
      })).text()).trim(), c = document.createElement("div");
      return c.innerHTML = u, c.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), b.set(t.full, u), n(u), u;
    } catch (u) {
      throw o(u), u;
    } finally {
      h.delete(t.full);
    }
  }
});
const v = /* @__PURE__ */ new Map();
l.sources.add("@", ({ path: a }) => {
  if (v.has(a.full))
    return v.get(a.full);
  const e = document.createElement("meta");
  document.head.append(e), e.setAttribute("__path__", a.path);
  const t = getComputedStyle(e).getPropertyValue("--__asset__").trim();
  e.remove(), t || p.raise(`Invalid path: ${a.full}`);
  const i = atob(t.slice(1, -1));
  return v.set(a.full, i), i;
});
const _ = /* @__PURE__ */ new Map();
l.types.add("css", async (a, { path: e }) => {
  if (typeof a != "string") return;
  const { Sheet: t } = await l("@/rollo/"), i = e.full;
  if (_.has(i)) return _.get(i);
  const r = t.create(a, i);
  return _.set(i, r), r;
});
const $ = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
l.types.add("js", async (a, { options: e, owner: t, path: i }) => {
  if (typeof a != "string") return;
  let r;
  const { as: s } = e, n = s === "function" ? `${i.full}?${s}` : i.full;
  if ($.has(n))
    return $.get(n);
  if (g.has(n)) {
    const u = await g.get(n);
    return g.delete(n), u;
  } else {
    const { promise: o, resolve: u, reject: c } = Promise.withResolvers();
    g.set(n, o);
    try {
      return s === "function" ? (r = Function(`return ${a}`)(), r == null && (r = !0)) : r = await t.module(
        `export const __path__ = "${i.path}";${a}`,
        i.path
      ), u(r), $.set(n, r), r;
    } catch (f) {
      throw c(f), f;
    } finally {
      g.delete(n);
    }
  }
});
l.types.add("json", (a) => {
  if (typeof a == "string")
    return JSON.parse(a);
});
const E = /* @__PURE__ */ new Map();
l.types.add("md", async (a, { options: e, path: t }) => {
  if (e.raw) return;
  if (e.cache !== !1 && E.has(t.full))
    return E.get(t.full);
  if (typeof a != "string") return;
  const { marked: i } = await l("@/marked");
  let r;
  if (a.startsWith("---")) {
    const { YAML: s } = await l("@/yaml"), [n, o] = a.split("---").slice(1), u = Object.freeze(s.parse(n)), c = i.parse(o);
    r = Object.freeze({ meta: u, html: c });
  } else
    r = i.parse(a);
  return e.cache !== !1 && E.set(t.full, r), r;
});
l.processors.add(
  "html",
  "template",
  async (a, { options: e, owner: t, path: i }) => {
    if (!e.convert || typeof a != "string") return;
    const { component: r } = await l("@/rollo/");
    return r.from(a);
  }
);
l.processors.add("css", async (a, e, ...t) => {
  if (O(a) !== "CSSStyleSheet") return;
  const i = t.filter(
    (r) => O(r) === "HTMLDocument" || r instanceof ShadowRoot || r.shadowRoot
  );
  i.length && a.use(...i);
});
const j = /* @__PURE__ */ new Map();
l.processors.add("x.html", "x.template", async (a, { path: e }) => {
  if (typeof a != "string") return;
  const { component: t, Sheet: i } = await l("@/rollo/");
  if (j.has(e.full)) return j.get(e.full);
  const r = t.div({ innerHTML: a }), s = await l.module(
    `export const __path__ = "${e.path}";${r.querySelector("script").textContent.trim()}`,
    e.path
  ), n = Object.fromEntries(
    Object.entries(s).filter(([c, f]) => f instanceof HTMLElement)
  ), o = {};
  for (const c of r.querySelectorAll("style")) {
    if (c.hasAttribute("for")) {
      const f = c.getAttribute("for"), A = i.create(
        `[uid="${n[f].uid}"] { ${c.textContent.trim()} }`
      );
      c.hasAttribute("global") && A.use(), c.hasAttribute("name") && (o[c.getAttribute("name")] = A);
      continue;
    }
    if (c.hasAttribute("global")) {
      const f = i.create(c.textContent.trim()).use();
      c.hasAttribute("name") && (o[c.getAttribute("name")] = f);
    } else
      o[c.hasAttribute("name") ? c.getAttribute("name") : "__sheet__"] = i.create(c.textContent.trim());
  }
  for (const c of r.querySelectorAll("template"))
    o[c.hasAttribute("name") ? c.getAttribute("name") : "__template__"] = c.innerHTML.trim();
  Object.freeze(o);
  const u = { __type__: "Module", assets: o };
  for (const [c, f] of Object.entries(s)) {
    if (typeof f == "function") {
      if (c === "setup") {
        await f.call(o, o);
        continue;
      }
      u[c] = f.bind(o);
      continue;
    }
    u[c] = f;
  }
  return j.set(e.full, Object.freeze(u)), u;
});
export {
  y as Path,
  w as Registry,
  p as UseError,
  d as assets,
  l as default
};

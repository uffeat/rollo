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
const D = {}, g = "https://rolloh.vercel.app", R = new class {
  #e = {};
  constructor() {
    const o = "https://rollohdev.anvil.app", e = "https://rolloh.anvil.app";
    this.#e.origin = location.origin === g || location.origin === e ? e : o, this.#e.PROD = this.#e.origin === e, this.#e.DEV = !this.#e.PROD, this.#e.env = this.#e.PROD ? "production" : "development";
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
  set targets(o) {
    this.#e.targets = o;
  }
}(), P = new class {
  #e = {
    detail: {}
  };
  constructor() {
    const o = "3869";
    this.#e.PROD = location.origin === g, this.#e.DEV = !this.#e.PROD, this.#e.ANVIL = R.origin === location.origin, this.#e.VITE = typeof import.meta < "u" && typeof D < "u" && "production", this.#e.base = this.#e.DEV && location.port !== o ? `http://localhost:${o}` : location.origin !== g ? g : "", this.#e.env = this.#e.PROD ? "production" : "development";
  }
  get ANVIL() {
    return this.#e.ANVIL;
  }
  /* Returns production origin */
  get BASE() {
    return g;
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
        Array.from(new URLSearchParams(i), ([n, a]) => {
          if (a = a.trim(), a === "") return [n, !0];
          if (a === "true") return [n, !0];
          const u = Number(a);
          return [n, Number.isNaN(u) ? a : u];
        }).filter(([n, a]) => !["false", "null", "undefined"].includes(a))
      )
    ) : this.#e.query = null;
    let r = t.split("/");
    if (this.#e.source = r.shift(), r.at(-1) === "" && (r[r.length - 1] = `${r[r.length - 2]}.js`), r.includes("")) {
      const n = r.findIndex((u) => u === ""), a = r[n + 1];
      r[n] = a.split(".")[0];
    }
    const s = r.at(-1);
    if (s && !s.includes(".") && (r[r.length - 1] = `${s}.js`), this.#e.parts = Object.freeze(r), this.#e.path = `/${r.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = r.at(-1), this.#e.file) {
      this.#e.stem = this.#e.file.split(".").at(0), this.#e.type = this.#e.file.split(".").at(-1);
      const [n, ...a] = this.#e.file.split(".");
      this.#e.types = a.join(".");
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
const O = (o) => Object.prototype.toString.call(o).slice(8, -1), d = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = P, this.#e.sources = new w(this), this.#e.processors = new class extends w {
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
    const i = { ...t.find((n, a) => !a && O(n) === "Object") || {} };
    t = t.filter((n) => n !== i);
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
      const a = await this.types.get(r.type)(
        s,
        { options: { ...i }, owner: this, path: r },
        ...t
      );
      a !== void 0 && (s = a);
    }
    if (r.detail.process !== !1 && this.processors.has(r.types)) {
      const a = await this.processors.get(r.types)(
        s,
        { options: { ...i }, owner: this, path: r },
        ...t
      );
      a !== void 0 && (s = a);
    }
    return s;
  }
  /* Returns module (native 'import' frunction) */
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
  get(o, e) {
    if (e === "assets")
      return d;
    const t = d[e];
    return typeof t == "function" ? t.bind(d) : t;
  },
  set(o, e, t) {
    return d[e] = t, !0;
  },
  apply(o, e, t) {
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
l.sources.add("/", async ({ options: o, owner: e, path: t }) => {
  const { as: i, raw: r } = o;
  if (t.type === "css" && i === void 0 && r !== !0) {
    l.meta.DEV && await l(t.path, { raw: !0 });
    const s = `${e.meta.base}${t.path}`;
    let n = document.head.querySelector(
      `link[rel="stylesheet"][href="${s}"]`
    );
    if (n)
      return h.has(s) ? h.get(s) : n;
    n = document.createElement("link"), n.rel = "stylesheet", n.href = s;
    const { promise: a, resolve: u, reject: c } = Promise.withResolvers();
    return h.set(s, a), n.addEventListener(
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
    ), document.head.append(n), await a;
  }
  if (t.type === "js" && r !== !0) {
    if (i === "script") {
      const s = `${e.meta.base}${t.path}`;
      let n = document.head.querySelector(`script[src="${s}"]`);
      if (n)
        return h.has(s) ? h.get(s) : !0;
      n = document.createElement("script"), n.src = s;
      const { promise: a, resolve: u, reject: c } = Promise.withResolvers();
      return h.set(s, a), n.addEventListener(
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
      ), document.head.append(n), await a;
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
    const { promise: s, resolve: n, reject: a } = Promise.withResolvers();
    h.set(t.full, s);
    try {
      const u = (await (await fetch(`${e.meta.base}${t.path}`, {
        cache: "no-store"
      })).text()).trim(), c = document.createElement("div");
      return c.innerHTML = u, c.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), b.set(t.full, u), n(u), u;
    } catch (u) {
      throw a(u), u;
    } finally {
      h.delete(t.full);
    }
  }
});
const v = /* @__PURE__ */ new Map();
l.sources.add("@", ({ path: o }) => {
  if (v.has(o.full))
    return v.get(o.full);
  const e = document.createElement("meta");
  document.head.append(e), e.setAttribute("__path__", o.path);
  const t = getComputedStyle(e).getPropertyValue("--__asset__").trim();
  e.remove(), t || p.raise(`Invalid path: ${o.full}`);
  const i = atob(t.slice(1, -1));
  return v.set(o.full, i), i;
});
const _ = /* @__PURE__ */ new Map();
l.types.add("css", async (o, { path: e }) => {
  if (typeof o != "string") return;
  const { Sheet: t } = await l("@/rollo/"), i = e.full;
  if (_.has(i)) return _.get(i);
  const r = t.create(o, i);
  return _.set(i, r), r;
});
const $ = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
l.types.add("js", async (o, { options: e, owner: t, path: i }) => {
  if (typeof o != "string") return;
  let r;
  const { as: s } = e, n = s === "function" ? `${i.full}?${s}` : i.full;
  if ($.has(n))
    return $.get(n);
  if (m.has(n)) {
    const u = await m.get(n);
    return m.delete(n), u;
  } else {
    const { promise: a, resolve: u, reject: c } = Promise.withResolvers();
    m.set(n, a);
    try {
      return s === "function" ? (r = Function(`return ${o}`)(), r === void 0 && (r = null)) : r = await t.module(
        `export const __path__ = "${i.path}";${o}`,
        i.path
      ), u(r), $.set(n, r), r;
    } catch (f) {
      throw c(f), f;
    } finally {
      m.delete(n);
    }
  }
});
l.types.add("json", (o) => {
  if (typeof o == "string")
    return JSON.parse(o);
});
const E = /* @__PURE__ */ new Map();
l.types.add("md", async (o, { options: e, path: t }) => {
  if (e.raw) return;
  if (e.cache !== !1 && E.has(t.full))
    return E.get(t.full);
  if (typeof o != "string") return;
  const { marked: i } = await l("@/marked");
  let r;
  if (o.startsWith("---")) {
    const { YAML: s } = await l("@/yaml"), [n, a] = o.split("---").slice(1), u = Object.freeze(s.parse(n)), c = i.parse(a);
    r = Object.freeze({ meta: u, html: c });
  } else
    r = i.parse(o);
  return e.cache !== !1 && E.set(t.full, r), r;
});
l.processors.add(
  "html",
  "template",
  async (o, { options: e, owner: t, path: i }) => {
    if (!e.convert || typeof o != "string") return;
    const { component: r } = await l("@/rollo/");
    return r.from(o);
  }
);
l.processors.add("css", async (o, e, ...t) => {
  if (O(o) !== "CSSStyleSheet") return;
  const i = t.filter(
    (r) => O(r) === "HTMLDocument" || r instanceof ShadowRoot || r.shadowRoot
  );
  i.length && o.use(...i);
});
const j = /* @__PURE__ */ new Map();
l.processors.add("x.html", "x.template", async (o, { path: e }) => {
  if (typeof o != "string") return;
  const { component: t, Sheet: i } = await l("@/rollo/");
  if (j.has(e.full)) return j.get(e.full);
  const r = t.div({ innerHTML: o }), s = await l.module(
    `export const __path__ = "${e.path}";${r.querySelector("script").textContent.trim()}`,
    e.path
  ), n = Object.fromEntries(
    Object.entries(s).filter(([c, f]) => f instanceof HTMLElement)
  ), a = {};
  for (const c of r.querySelectorAll("style")) {
    if (c.hasAttribute("for")) {
      const f = c.getAttribute("for"), A = i.create(
        `[uid="${n[f].uid}"] { ${c.textContent.trim()} }`
      );
      c.hasAttribute("global") && A.use(), c.hasAttribute("name") && (a[c.getAttribute("name")] = A);
      continue;
    }
    if (c.hasAttribute("global")) {
      const f = i.create(c.textContent.trim()).use();
      c.hasAttribute("name") && (a[c.getAttribute("name")] = f);
    } else
      a[c.hasAttribute("name") ? c.getAttribute("name") : "__sheet__"] = i.create(c.textContent.trim());
  }
  for (const c of r.querySelectorAll("template"))
    a[c.hasAttribute("name") ? c.getAttribute("name") : "__template__"] = c.innerHTML.trim();
  Object.freeze(a);
  const u = { __type__: "Module", assets: a };
  for (const [c, f] of Object.entries(s)) {
    if (typeof f == "function") {
      if (c === "setup") {
        await f.call(a, a);
        continue;
      }
      u[c] = f.bind(a);
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

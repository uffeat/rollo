class p extends Error {
  static raise = (e, t) => {
    throw t?.(), new p(e);
  };
  static if = (e, t, o) => {
    typeof e == "function" && (e = e()), e && p.raise(t, o);
  };
  constructor(e) {
    super(e), this.name = "UseError";
  }
}
const k = {}, S = location.hostname === "localhost", g = new class {
  #e = {};
  get origin() {
    return this.#e.origin;
  }
  set origin(r) {
    this.#e.origin = r;
  }
  get targets() {
    return this.#e.targets;
  }
  set targets(r) {
    if (this.#e.targets)
      throw new Error("Cannot change targets.");
    this.#e.targets = r;
  }
}(), L = new class {
  #e = {
    detail: {}
  };
  constructor() {
    if (S) {
      const r = "3869";
      location.port === r ? this.#e.base = "" : this.#e.base = `http://localhost:${r}`, g.origin = "https://rollohdev.anvil.app";
    } else {
      const r = "https://rolloh.vercel.app";
      location.origin === r ? (this.#e.base = "", g.origin = "https://rolloh.anvil.app") : (this.#e.base = r, g.origin = location.origin, this.#e.ANVIL = !0);
    }
  }
  get ANVIL() {
    return this.#e.ANVIL || !1;
  }
  get DEV() {
    return S;
  }
  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return this.#e.VITE || (this.#e.VITE = typeof import.meta < "u" && typeof k < "u" && "production"), this.#e.VITE;
  }
  get base() {
    return this.#e.base;
  }
  set base(r) {
    this.#e.base = r;
  }
  get detail() {
    return this.#e.detail;
  }
  get env() {
    return this.DEV ? "development" : "production";
  }
  get server() {
    return g;
  }
  get session() {
    return this.#e.session || (this.#e.session = crypto.randomUUID()), this.#e.session;
  }
  set session(r) {
    if (this.#e.session)
      throw new Error("Cannot change session.");
    this.#e.session = r;
  }
  get token() {
    if (!this.#e.token) {
      const r = "__token__", e = localStorage.getItem(r);
      e ? this.#e.token = e : (this.#e.token = crypto.randomUUID(), localStorage.setItem(r, this.#e.token));
    }
    return this.#e.token;
  }
}();
class y {
  static create = (e) => e instanceof y ? e : new y(e);
  #e = {
    detail: {}
  };
  constructor(e) {
    this.#e.specifier = e;
    const [t, o] = e.split("?");
    o ? this.#e.query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(o), ([i, a]) => {
          if (a = a.trim(), a === "") return [i, !0];
          if (a === "true") return [i, !0];
          const l = Number(a);
          return [i, Number.isNaN(l) ? a : l];
        }).filter(([i, a]) => !["false", "null", "undefined"].includes(a))
      )
    ) : this.#e.query = null;
    let s = t.split("/");
    if (this.#e.source = s.shift(), s.at(-1) === "" && (s[s.length - 1] = `${s[s.length - 2]}.js`), s.includes("")) {
      const i = s.findIndex((l) => l === ""), a = s[i + 1];
      s[i] = a.split(".")[0];
    }
    const n = s.at(-1);
    if (n && !n.includes(".") && (s[s.length - 1] = `${n}.js`), this.#e.parts = Object.freeze(s), this.#e.path = `/${s.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = s.at(-1), this.#e.file) {
      this.#e.stem = this.#e.file.split(".").at(0), this.#e.type = this.#e.file.split(".").at(-1);
      const [i, ...a] = this.#e.file.split(".");
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
class b {
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
const w = (r) => Object.prototype.toString.call(r).slice(8, -1), d = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = L, this.#e.sources = new b(this), this.#e.processors = new class extends b {
      #t = {};
      constructor(t) {
        const o = /* @__PURE__ */ new Map();
        super(t, o), this.#t.registry = o;
      }
      add(...t) {
        const o = t.pop();
        for (const s of t)
          this.#t.registry.set(s, o);
        return this.owner;
      }
    }(this), this.#e.types = new b(this);
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
    const o = { ...t.find((i) => w(i) === "Object") || {} };
    t = t.filter((i) => w(i) !== "Object");
    const s = y.create(e);
    let n;
    if (this.#e.added.has(s.full) ? (n = this.#e.added.get(s.full), typeof n == "function" && (n = await n({ path: s }))) : (this.sources.has(s.source) || p.raise(`Invalid source: ${s.source}`), n = await this.sources.get(s.source)(
      { options: { ...o }, owner: this, path: s },
      ...t
    )), s.detail.escape || n instanceof Error) return n;
    if (o.raw)
      return o.spec ? Object.freeze({
        path: s.full,
        source: s.source,
        text: n,
        type: s.type
      }) : n;
    if (s.detail.transform !== !1 && this.types.has(s.type)) {
      const a = await this.types.get(s.type)(
        n,
        { options: { ...o }, owner: this, path: s },
        ...t
      );
      a !== void 0 && (n = a);
    }
    if (s.detail.process !== !1 && this.processors.has(s.types)) {
      const a = await this.processors.get(s.types)(
        n,
        { options: { ...o }, owner: this, path: s },
        ...t
      );
      a !== void 0 && (n = a);
    }
    return n;
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
    const o = URL.createObjectURL(
      new Blob([e], { type: "text/javascript" })
    ), s = await this.import(o);
    return URL.revokeObjectURL(o), s;
  }
}(), u = new Proxy(async () => {
}, {
  get(r, e) {
    if (e === "assets")
      return d;
    const t = d[e];
    return typeof t == "function" ? t.bind(d) : t;
  },
  set(r, e, t) {
    return d[e] = t, !0;
  },
  apply(r, e, t) {
    return d.get(...t);
  }
});
Object.defineProperty(globalThis, "use", {
  configurable: d.meta.DEV,
  enumerable: !0,
  writable: d.meta.DEV,
  value: u
});
window.dispatchEvent(new CustomEvent("_use"));
const _ = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
u.sources.add("/", async ({ options: r, owner: e, path: t }) => {
  const { as: o, raw: s } = r;
  if (t.type === "css" && o === void 0 && s !== !0) {
    u.meta.DEV && await u(t.path, { raw: !0 });
    const n = `${e.meta.base}${t.path}`;
    let i = document.head.querySelector(
      `link[rel="stylesheet"][href="${n}"]`
    );
    if (i)
      return h.has(n) ? h.get(n) : i;
    i = document.createElement("link"), i.rel = "stylesheet", i.href = n;
    const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
    return h.set(n, a), i.addEventListener(
      "load",
      (f) => {
        l(i), h.delete(n);
      },
      { once: !0 }
    ), i.addEventListener(
      "error",
      (f) => {
        h.delete(n), c(new p(`Failed to load sheet: ${n}`));
      },
      { once: !0 }
    ), document.head.append(i), await a;
  }
  if (t.type === "js" && s !== !0) {
    if (o === "script") {
      const n = `${e.meta.base}${t.path}`;
      let i = document.head.querySelector(`script[src="${n}"]`);
      if (i)
        return h.has(n) ? h.get(n) : !0;
      i = document.createElement("script"), i.src = n;
      const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
      return h.set(n, a), i.addEventListener(
        "load",
        (f) => {
          h.delete(n), l(!0);
        },
        { once: !0 }
      ), i.addEventListener(
        "error",
        (f) => {
          h.delete(n), c(new p(`Failed to load script: ${n}`));
        },
        { once: !0 }
      ), document.head.append(i), await a;
    }
    if (o === void 0)
      return await e.import(`${e.meta.base}${t.path}`);
  }
  if (_.has(t.full))
    return _.get(t.full);
  if (h.has(t.full)) {
    const i = await h.get(t.full);
    return h.delete(t.full), i;
  } else {
    const { promise: n, resolve: i, reject: a } = Promise.withResolvers();
    h.set(t.full, n);
    try {
      const l = (await (await fetch(`${e.meta.base}${t.path}`, {
        cache: "no-store"
      })).text()).trim(), c = document.createElement("div");
      return c.innerHTML = l, c.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), _.set(t.full, l), i(l), l;
    } catch (l) {
      throw a(l), l;
    } finally {
      h.delete(t.full);
    }
  }
});
const v = /* @__PURE__ */ new Map();
u.sources.add("@", ({ path: r }) => {
  if (v.has(r.full))
    return v.get(r.full);
  const e = document.createElement("meta");
  document.head.append(e), e.setAttribute("__path__", r.path);
  const t = getComputedStyle(e).getPropertyValue("--__asset__").trim();
  e.remove(), t || p.raise(`Invalid path: ${r.full}`);
  const o = atob(t.slice(1, -1));
  return v.set(r.full, o), o;
});
const $ = /* @__PURE__ */ new Map();
u.types.add("css", async (r, { path: e }) => {
  if (typeof r != "string") return;
  const { Sheet: t } = await u("@/rollo/"), o = e.full;
  if ($.has(o)) return $.get(o);
  const s = t.create(r, o);
  return $.set(o, s), s;
});
const j = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
u.types.add("js", async (r, { options: e, owner: t, path: o }) => {
  if (typeof r != "string") return;
  let s;
  const { as: n } = e, i = n === "function" ? `${o.full}?${n}` : o.full;
  if (j.has(i))
    return j.get(i);
  if (m.has(i)) {
    const l = await m.get(i);
    return m.delete(i), l;
  } else {
    const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
    m.set(i, a);
    try {
      return n === "function" ? (s = Function(`return ${r}`)(), s === void 0 && (s = null)) : s = await t.module(
        `export const __path__ = "${o.path}";${r}`,
        o.path
      ), l(s), j.set(i, s), s;
    } catch (f) {
      throw c(f), f;
    } finally {
      m.delete(i);
    }
  }
});
u.types.add("json", (r) => {
  if (typeof r == "string")
    return JSON.parse(r);
});
const E = /* @__PURE__ */ new Map();
u.types.add("md", async (r, { options: e, path: t }) => {
  if (e.raw) return;
  if (e.cache !== !1 && E.has(t.full))
    return E.get(t.full);
  if (typeof r != "string") return;
  const { marked: o } = await u("@/marked");
  let s;
  if (r.startsWith("---")) {
    const { YAML: n } = await u("@/yaml"), [i, a] = r.split("---").slice(1), l = Object.freeze(n.parse(i)), c = o.parse(a);
    s = Object.freeze({ meta: l, html: c });
  } else
    s = o.parse(r);
  return e.cache !== !1 && E.set(t.full, s), s;
});
u.processors.add(
  "html",
  "template",
  async (r, { options: e, owner: t, path: o }) => {
    if (!e.convert || typeof r != "string") return;
    const { component: s } = await u("@/rollo/");
    return s.from(r);
  }
);
u.processors.add("css", async (r, e, ...t) => {
  if (w(r) !== "CSSStyleSheet") return;
  const o = t.filter(
    (s) => w(s) === "HTMLDocument" || s instanceof ShadowRoot || s.shadowRoot
  );
  o.length && r.use(...o);
});
const A = /* @__PURE__ */ new Map();
u.processors.add("x.html", "x.template", async (r, { path: e }) => {
  if (typeof r != "string") return;
  const { component: t, Sheet: o } = await u("@/rollo/");
  if (A.has(e.full)) return A.get(e.full);
  const s = t.div({ innerHTML: r }), n = await u.module(
    `export const __path__ = "${e.path}";${s.querySelector("script").textContent.trim()}`,
    e.path
  ), i = Object.fromEntries(
    Object.entries(n).filter(([c, f]) => f instanceof HTMLElement)
  ), a = {};
  for (const c of s.querySelectorAll("style")) {
    if (c.hasAttribute("for")) {
      const f = c.getAttribute("for"), O = o.create(
        `[uid="${i[f].uid}"] { ${c.textContent.trim()} }`
      );
      c.hasAttribute("global") && O.use(), c.hasAttribute("name") && (a[c.getAttribute("name")] = O);
      continue;
    }
    if (c.hasAttribute("global")) {
      const f = o.create(c.textContent.trim()).use();
      c.hasAttribute("name") && (a[c.getAttribute("name")] = f);
    } else
      a[c.hasAttribute("name") ? c.getAttribute("name") : "__sheet__"] = o.create(c.textContent.trim());
  }
  for (const c of s.querySelectorAll("template"))
    a[c.hasAttribute("name") ? c.getAttribute("name") : "__template__"] = c.innerHTML.trim();
  Object.freeze(a);
  const l = { __type__: "Module", assets: a };
  for (const [c, f] of Object.entries(n)) {
    if (typeof f == "function") {
      if (c === "setup") {
        await f.call(a, a);
        continue;
      }
      l[c] = f.bind(a);
      continue;
    }
    l[c] = f;
  }
  return A.set(e.full, Object.freeze(l)), l;
});
export {
  p as UseError,
  d as assets,
  u as default
};

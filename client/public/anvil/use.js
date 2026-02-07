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
const S = {}, M = location.hostname === "localhost", L = typeof import.meta < "u" && typeof S < "u" && "production", y = new class {
  #e = {};
  get origin() {
    return this.#e.origin;
  }
  set origin(e) {
    this.#e.origin = e;
  }
}(), R = new class {
  #e = {};
  constructor() {
    if (M) {
      const e = "3869";
      location.port === e ? this.#e.base = "" : this.#e.base = `http://localhost:${e}`, y.origin = "https://rollohdev.anvil.app";
    } else {
      const e = "https://rolloh.vercel.app";
      location.origin === e ? (this.#e.base = "", y.origin = "https://rolloh.anvil.app") : (this.#e.base = e, y.origin = location.origin);
    }
  }
  get DEV() {
    return M;
  }
  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return L;
  }
  get base() {
    return this.#e.base;
  }
  set base(e) {
    this.#e.base = e;
  }
  get server() {
    return y;
  }
}();
class g {
  static create = (e) => e instanceof g ? e : new g(e);
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
          const l = Number(o);
          return [n, Number.isNaN(l) ? o : l];
        }).filter(([n, o]) => !["false", "null", "undefined"].includes(o))
      )
    ) : this.#e.query = null;
    let s = t.split("/");
    if (this.#e.source = s.shift(), s.at(-1) === "" && (s[s.length - 1] = `${s[s.length - 2]}.js`), s.includes("")) {
      const n = s.findIndex((l) => l === ""), o = s[n + 1];
      s[n] = o.split(".")[0];
    }
    const r = s.at(-1);
    if (r && !r.includes(".") && (s[s.length - 1] = `${r}.js`), this.#e.parts = Object.freeze(s), this.#e.path = `/${s.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = s.at(-1), this.#e.file) {
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
const w = (a) => Object.prototype.toString.call(a).slice(8, -1), d = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = R, this.#e.sources = new b(this), this.#e.processors = new class extends b {
      #t = {};
      constructor(t) {
        const i = /* @__PURE__ */ new Map();
        super(t, i), this.#t.registry = i;
      }
      add(...t) {
        const i = t.pop();
        for (const s of t)
          this.#t.registry.set(s, i);
        return this.owner;
      }
    }(this), this.#e.types = new b(this);
  }
  // TODO Use or kill.
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
    const i = { ...t.find((n) => w(n) === "Object") || {} };
    t = t.filter((n) => w(n) !== "Object");
    const s = g.create(e);
    let r;
    if (this.#e.added.has(s.full) ? (r = this.#e.added.get(s.full), typeof r == "function" && (r = await r({ path: s }))) : (this.sources.has(s.source) || p.raise(`Invalid source: ${s.source}`), r = await this.sources.get(s.source)(
      { options: { ...i }, owner: this, path: s },
      ...t
    )), s.detail.escape || r instanceof Error) return r;
    if (i.raw)
      return i.spec ? Object.freeze({
        path: s.full,
        source: s.source,
        text: r,
        type: s.type
      }) : r;
    if (s.detail.transform !== !1 && this.types.has(s.type)) {
      const o = await this.types.get(s.type)(
        r,
        { options: { ...i }, owner: this, path: s },
        ...t
      );
      o !== void 0 && (r = o);
    }
    if (s.detail.process !== !1 && this.processors.has(s.types)) {
      const o = await this.processors.get(s.types)(
        r,
        { options: { ...i }, owner: this, path: s },
        ...t
      );
      o !== void 0 && (r = o);
    }
    return r;
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
    ), s = await this.import(i);
    return URL.revokeObjectURL(i), s;
  }
}(), u = new Proxy(async () => {
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
  value: u
});
window.dispatchEvent(new CustomEvent("_use"));
const v = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
u.sources.add("/", async ({ options: a, owner: e, path: t }) => {
  const { as: i, raw: s } = a;
  if (t.type === "css" && i === void 0 && s !== !0) {
    u.meta.DEV && await u(t.path, { raw: !0 });
    const r = `${e.meta.base}${t.path}`;
    let n = document.head.querySelector(
      `link[rel="stylesheet"][href="${r}"]`
    );
    if (n)
      return h.has(r) ? h.get(r) : n;
    n = document.createElement("link"), n.rel = "stylesheet", n.href = r;
    const { promise: o, resolve: l, reject: c } = Promise.withResolvers();
    return h.set(r, o), n.addEventListener(
      "load",
      (f) => {
        l(n), h.delete(r);
      },
      { once: !0 }
    ), n.addEventListener(
      "error",
      (f) => {
        h.delete(r), c(new p(`Failed to load sheet: ${r}`));
      },
      { once: !0 }
    ), document.head.append(n), await o;
  }
  if (t.type === "js" && s !== !0) {
    if (i === "script") {
      const r = `${e.meta.base}${t.path}`;
      let n = document.head.querySelector(`script[src="${r}"]`);
      if (n)
        return h.has(r) ? h.get(r) : !0;
      n = document.createElement("script"), n.src = r;
      const { promise: o, resolve: l, reject: c } = Promise.withResolvers();
      return h.set(r, o), n.addEventListener(
        "load",
        (f) => {
          h.delete(r), l(!0);
        },
        { once: !0 }
      ), n.addEventListener(
        "error",
        (f) => {
          h.delete(r), c(new p(`Failed to load script: ${r}`));
        },
        { once: !0 }
      ), document.head.append(n), await o;
    }
    if (i === void 0)
      return await e.import(`${e.meta.base}${t.path}`);
  }
  if (v.has(t.full))
    return v.get(t.full);
  if (h.has(t.full)) {
    const n = await h.get(t.full);
    return h.delete(t.full), n;
  } else {
    const { promise: r, resolve: n, reject: o } = Promise.withResolvers();
    h.set(t.full, r);
    try {
      const l = (await (await fetch(`${e.meta.base}${t.path}`, {
        cache: "no-store"
      })).text()).trim(), c = document.createElement("div");
      return c.innerHTML = l, c.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), v.set(t.full, l), n(l), l;
    } catch (l) {
      throw o(l), l;
    } finally {
      h.delete(t.full);
    }
  }
});
const _ = /* @__PURE__ */ new Map();
u.sources.add("@", ({ path: a }) => {
  if (_.has(a.full))
    return _.get(a.full);
  const e = document.createElement("meta");
  document.head.append(e), e.setAttribute("__path__", a.path);
  const t = getComputedStyle(e).getPropertyValue("--__asset__").trim();
  e.remove(), t || p.raise(`Invalid path: ${a.full}`);
  const i = atob(t.slice(1, -1));
  return _.set(a.full, i), i;
});
const $ = /* @__PURE__ */ new Map();
u.types.add("css", async (a, { path: e }) => {
  if (typeof a != "string") return;
  const { Sheet: t } = await u("@/rollo/"), i = e.full;
  if ($.has(i)) return $.get(i);
  const s = t.create(a, i);
  return $.set(i, s), s;
});
const j = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
u.types.add("js", async (a, { options: e, owner: t, path: i }) => {
  if (typeof a != "string") return;
  let s;
  const { as: r } = e, n = r === "function" ? `${i.full}?${r}` : i.full;
  if (j.has(n))
    return j.get(n);
  if (m.has(n)) {
    const l = await m.get(n);
    return m.delete(n), l;
  } else {
    const { promise: o, resolve: l, reject: c } = Promise.withResolvers();
    m.set(n, o);
    try {
      return r === "function" ? (s = Function(`return ${a}`)(), s === void 0 && (s = null)) : s = await t.module(
        `export const __path__ = "${i.path}";${a}`,
        i.path
      ), l(s), j.set(n, s), s;
    } catch (f) {
      throw c(f), f;
    } finally {
      m.delete(n);
    }
  }
});
u.types.add("json", (a) => {
  if (typeof a == "string")
    return JSON.parse(a);
});
const E = /* @__PURE__ */ new Map();
u.types.add("md", async (a, { options: e, path: t }) => {
  if (e.raw) return;
  if (e.cache !== !1 && E.has(t.full))
    return E.get(t.full);
  if (typeof a != "string") return;
  const { marked: i } = await u("@/marked");
  let s;
  if (a.startsWith("---")) {
    const { YAML: r } = await u("@/yaml"), [n, o] = a.split("---").slice(1), l = Object.freeze(r.parse(n)), c = i.parse(o);
    s = Object.freeze({ meta: l, html: c });
  } else
    s = i.parse(a);
  return e.cache !== !1 && E.set(t.full, s), s;
});
u.processors.add(
  "html",
  "template",
  async (a, { options: e, owner: t, path: i }) => {
    if (!e.convert || typeof a != "string") return;
    const { component: s } = await u("@/rollo/");
    return s.from(a);
  }
);
u.processors.add("css", async (a, e, ...t) => {
  if (w(a) !== "CSSStyleSheet") return;
  const i = t.filter(
    (s) => w(s) === "HTMLDocument" || s instanceof ShadowRoot || s.shadowRoot
  );
  i.length && a.use(...i);
});
const A = /* @__PURE__ */ new Map();
u.processors.add("x.html", "x.template", async (a, { path: e }) => {
  if (typeof a != "string") return;
  const { component: t, Sheet: i } = await u("@/rollo/");
  if (A.has(e.full)) return A.get(e.full);
  const s = t.div({ innerHTML: a }), r = await u.module(
    `export const __path__ = "${e.path}";${s.querySelector("script").textContent.trim()}`,
    e.path
  ), n = Object.fromEntries(
    Object.entries(r).filter(([c, f]) => f instanceof HTMLElement)
  ), o = {};
  for (const c of s.querySelectorAll("style")) {
    if (c.hasAttribute("for")) {
      const f = c.getAttribute("for"), O = i.create(
        `[uid="${n[f].uid}"] { ${c.textContent.trim()} }`
      );
      c.hasAttribute("global") && O.use(), c.hasAttribute("name") && (o[c.getAttribute("name")] = O);
      continue;
    }
    if (c.hasAttribute("global")) {
      const f = i.create(c.textContent.trim()).use();
      c.hasAttribute("name") && (o[c.getAttribute("name")] = f);
    } else
      o[c.hasAttribute("name") ? c.getAttribute("name") : "__sheet__"] = i.create(c.textContent.trim());
  }
  for (const c of s.querySelectorAll("template"))
    o[c.hasAttribute("name") ? c.getAttribute("name") : "__template__"] = c.innerHTML.trim();
  Object.freeze(o);
  const l = { __type__: "Module", assets: o };
  for (const [c, f] of Object.entries(r)) {
    if (typeof f == "function") {
      if (c === "setup") {
        await f.call(o, o);
        continue;
      }
      l[c] = f.bind(o);
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

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
const L = {}, w = location.hostname === "localhost", M = "3869", R = typeof import.meta < "u" && typeof L < "u" && "production", S = new class {
  #e = {};
  get origin() {
    return this.#e.origin;
  }
  set origin(o) {
    this.#e.origin = o;
  }
}();
class k {
  #e = {};
  constructor() {
    const e = "https://rolloh.vercel.app";
    S.origin = w ? "https://rollohdev.anvil.app" : "https://rolloh.anvil.app", w ? location.port === M ? this.#e.base = "" : this.#e.base = `http://localhost:${M}` : location.origin === e ? this.#e.base = "" : this.#e.base = e;
  }
  get DEV() {
    return w;
  }
  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return R;
  }
  get base() {
    return this.#e.base;
  }
  set base(e) {
    this.#e.base = e;
  }
  get server() {
    return S;
  }
}
const q = new k();
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
          const l = Number(a);
          return [n, Number.isNaN(l) ? a : l];
        }).filter(([n, a]) => !["false", "null", "undefined"].includes(a))
      )
    ) : this.#e.query = null;
    let s = t.split("/");
    if (this.#e.source = s.shift(), s.at(-1) === "" && (s[s.length - 1] = `${s[s.length - 2]}.js`), s.includes("")) {
      const n = s.findIndex((l) => l === ""), a = s[n + 1];
      s[n] = a.split(".")[0];
    }
    const r = s.at(-1);
    if (r && !r.includes(".") && (s[s.length - 1] = `${r}.js`), this.#e.parts = Object.freeze(s), this.#e.path = `/${s.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = s.at(-1), this.#e.file) {
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
  /* Returns string with pseudo files types and declared file type. */
  get types() {
    return this.#e.types;
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
const g = (o) => Object.prototype.toString.call(o).slice(8, -1), d = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = q, this.#e.sources = new b(this), this.#e.processors = new class extends b {
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
    const i = { ...t.find((n) => g(n) === "Object") || {} };
    t = t.filter((n) => g(n) !== "Object");
    const s = y.create(e);
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
      const a = await this.types.get(s.type)(
        r,
        { options: { ...i }, owner: this, path: s },
        ...t
      );
      a !== void 0 && (r = a);
    }
    if (s.detail.process !== !1 && this.processors.has(s.types)) {
      const a = await this.processors.get(s.types)(
        r,
        { options: { ...i }, owner: this, path: s },
        ...t
      );
      a !== void 0 && (r = a);
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
  value: u
});
window.dispatchEvent(new CustomEvent("_use"));
const _ = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
u.sources.add("/", async ({ options: o, owner: e, path: t }) => {
  const { as: i, raw: s } = o;
  if (t.type === "css" && i === void 0 && s !== !0) {
    u.meta.DEV && await u(t.path, { raw: !0 });
    const r = `${e.meta.base}${t.path}`;
    let n = document.head.querySelector(
      `link[rel="stylesheet"][href="${r}"]`
    );
    if (n)
      return h.has(r) ? h.get(r) : n;
    n = document.createElement("link"), n.rel = "stylesheet", n.href = r;
    const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
    return h.set(r, a), n.addEventListener(
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
    ), document.head.append(n), await a;
  }
  if (t.type === "js" && s !== !0) {
    if (i === "script") {
      const r = `${e.meta.base}${t.path}`;
      let n = document.head.querySelector(`script[src="${r}"]`);
      if (n)
        return h.has(r) ? h.get(r) : !0;
      n = document.createElement("script"), n.src = r;
      const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
      return h.set(r, a), n.addEventListener(
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
      ), document.head.append(n), await a;
    }
    if (i === void 0)
      return await e.import(`${e.meta.base}${t.path}`);
  }
  if (_.has(t.full))
    return _.get(t.full);
  if (h.has(t.full)) {
    const n = await h.get(t.full);
    return h.delete(t.full), n;
  } else {
    const { promise: r, resolve: n, reject: a } = Promise.withResolvers();
    h.set(t.full, r);
    try {
      const l = (await (await fetch(`${e.meta.base}${t.path}`, {
        cache: "no-store"
      })).text()).trim(), c = document.createElement("div");
      return c.innerHTML = l, c.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), _.set(t.full, l), n(l), l;
    } catch (l) {
      throw a(l), l;
    } finally {
      h.delete(t.full);
    }
  }
});
const v = /* @__PURE__ */ new Map();
u.sources.add("@", ({ path: o }) => {
  if (v.has(o.full))
    return v.get(o.full);
  const e = document.createElement("meta");
  document.head.append(e), e.setAttribute("__path__", o.path);
  const t = getComputedStyle(e).getPropertyValue("--__asset__").trim();
  e.remove(), t || p.raise(`Invalid path: ${o.full}`);
  const i = atob(t.slice(1, -1));
  return v.set(o.full, i), i;
});
const $ = /* @__PURE__ */ new Map();
u.types.add("css", async (o, { path: e }) => {
  if (typeof o != "string") return;
  const { Sheet: t } = await u("@/rollo/"), i = e.full;
  if ($.has(i)) return $.get(i);
  const s = t.create(o, i);
  return $.set(i, s), s;
});
const j = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
u.types.add("js", async (o, { options: e, owner: t, path: i }) => {
  if (typeof o != "string") return;
  let s;
  const { as: r } = e, n = r === "function" ? `${i.full}?${r}` : i.full;
  if (j.has(n))
    return j.get(n);
  if (m.has(n)) {
    const l = await m.get(n);
    return m.delete(n), l;
  } else {
    const { promise: a, resolve: l, reject: c } = Promise.withResolvers();
    m.set(n, a);
    try {
      return r === "function" ? (s = Function(`return ${o}`)(), s === void 0 && (s = null)) : s = await t.module(
        `export const __path__ = "${i.path}";${o}`,
        i.path
      ), l(s), j.set(n, s), s;
    } catch (f) {
      throw c(f), f;
    } finally {
      m.delete(n);
    }
  }
});
u.types.add("json", (o) => {
  if (typeof o == "string")
    return JSON.parse(o);
});
const E = /* @__PURE__ */ new Map();
u.types.add("md", async (o, { options: e, path: t }) => {
  if (e.raw) return;
  if (e.cache !== !1 && E.has(t.full))
    return E.get(t.full);
  if (typeof o != "string") return;
  const { marked: i } = await u("@/marked");
  let s;
  if (o.startsWith("---")) {
    const { YAML: r } = await u("@/yaml"), [n, a] = o.split("---").slice(1), l = Object.freeze(r.parse(n)), c = i.parse(a);
    s = Object.freeze({ meta: l, html: c });
  } else
    s = i.parse(o);
  return e.cache !== !1 && E.set(t.full, s), s;
});
u.processors.add(
  "html",
  "template",
  async (o, { options: e, owner: t, path: i }) => {
    if (!e.convert || typeof o != "string") return;
    const { component: s } = await u("@/rollo/");
    return s.from(o);
  }
);
u.processors.add("css", async (o, e, ...t) => {
  if (g(o) !== "CSSStyleSheet") return;
  const i = t.filter(
    (s) => g(s) === "HTMLDocument" || s instanceof ShadowRoot || s.shadowRoot
  );
  i.length && o.use(...i);
});
const A = /* @__PURE__ */ new Map();
u.processors.add("x.html", "x.template", async (o, { path: e }) => {
  if (typeof o != "string") return;
  const { component: t, Sheet: i } = await u("@/rollo/");
  if (A.has(e.full)) return A.get(e.full);
  const s = t.div({ innerHTML: o }), r = await u.module(
    `export const __path__ = "${e.path}";${s.querySelector("script").textContent.trim()}`,
    e.path
  ), n = Object.fromEntries(
    Object.entries(r).filter(([c, f]) => f instanceof HTMLElement)
  ), a = {};
  for (const c of s.querySelectorAll("style")) {
    if (c.hasAttribute("for")) {
      const f = c.getAttribute("for"), O = i.create(
        `[uid="${n[f].uid}"] { ${c.textContent.trim()} }`
      );
      c.hasAttribute("global") && O.use(), c.hasAttribute("name") && (a[c.getAttribute("name")] = O);
      continue;
    }
    if (c.hasAttribute("global")) {
      const f = i.create(c.textContent.trim()).use();
      c.hasAttribute("name") && (a[c.getAttribute("name")] = f);
    } else
      a[c.hasAttribute("name") ? c.getAttribute("name") : "__sheet__"] = i.create(c.textContent.trim());
  }
  for (const c of s.querySelectorAll("template"))
    a[c.hasAttribute("name") ? c.getAttribute("name") : "__template__"] = c.innerHTML.trim();
  Object.freeze(a);
  const l = { __type__: "Module", assets: a };
  for (const [c, f] of Object.entries(r)) {
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

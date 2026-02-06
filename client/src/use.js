class y {
  static create = (e) => e instanceof y ? e : new y(e);
  #e = {
    detail: {}
  };
  constructor(e) {
    this.#e.specifier = e;
    const [s, o] = e.split("?");
    o ? this.#e.query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(o), ([l, r]) => {
          if (r = r.trim(), r === "") return [l, !0];
          if (r === "true") return [l, !0];
          const n = Number(r);
          return [l, Number.isNaN(n) ? r : n];
        }).filter(([l, r]) => !["false", "null", "undefined"].includes(r))
      )
    ) : this.#e.query = null;
    let t = s.split("/");
    if (this.#e.source = t.shift(), t.at(-1) === "" && (t[t.length - 1] = `${t[t.length - 2]}.js`), t.includes("")) {
      const l = t.findIndex((n) => n === ""), r = t[l + 1];
      t[l] = r.split(".")[0];
    }
    const c = t.at(-1);
    if (c && !c.includes(".") && (t[t.length - 1] = `${c}.js`), this.#e.parts = Object.freeze(t), this.#e.path = `/${t.join("/")}`, this.#e.full = `${this.#e.source}${this.#e.path}`, this.#e.file = t.at(-1), this.#e.file) {
      this.#e.stem = this.#e.file.split(".").at(0), this.#e.type = this.#e.file.split(".").at(-1);
      const [l, ...r] = this.#e.file.split(".");
      this.#e.types = r.join(".");
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
class w {
  #e = {
    detail: {}
  };
  constructor(e, s) {
    this.#e.owner = e, this.#e.registry = s || /* @__PURE__ */ new Map();
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
  add(e, s) {
    return this.#e.registry.set(e, s), this.owner;
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
class p extends Error {
  static raise = (e, s) => {
    throw s?.(), new p(e);
  };
  static if = (e, s, o) => {
    typeof e == "function" && (e = e()), e && p.raise(s, o);
  };
  constructor(e) {
    super(e), this.name = "UseError";
  }
}
const b = {};
class v {
  #e = {
    detail: {}
  };
  constructor() {
    const e = "3869", s = "https://rolloh.vercel.app";
    this.#e.VITE = typeof import.meta < "u" && typeof b < "u" && "production", this.#e.DEV = location.hostname === "localhost", this.#e.env = this.#e.DEV ? "development" : "production", this.#e.embedded = window !== window.parent, this.#e.companion = new class {
      #t = {};
      constructor(o) {
        this.#t.owner = o, this.#t.owner.embedded ? this.#t.origin = window.parent.location.origin : this.#t.origin = this.#t.owner.DEV ? "https://rollohdev.anvil.app" : "https://rolloh.anvil.app";
      }
      get origin() {
        return this.#t.origin;
      }
    }(this), this.embedded ? this.#e.base = s : this.DEV ? location.port === e ? this.#e.base = "" : this.#e.base = `http://localhost:${e}` : this.origin === this.companion.origin ? this.#e.base = s : this.#e.base = "";
  }
  get DEV() {
    return this.#e.DEV;
  }
  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return this.#e.VITE;
  }
  get base() {
    return this.#e.base;
  }
  set base(e) {
    this.#e.base = e;
  }
  get companion() {
    return this.#e.companion;
  }
  get detail() {
    return this.#e.detail;
  }
  get embedded() {
    return this.#e.embedded;
  }
  get env() {
    return this.#e.env;
  }
  get origin() {
    return location.origin;
  }
}
const _ = new v(), g = (i) => Object.prototype.toString.call(i).slice(8, -1), m = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    /* Rebuild native 'import' to prevent Vite from barking */
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = _, this.#e.sources = new w(this), this.#e.processors = new class extends w {
      #t = {};
      constructor(s) {
        const o = /* @__PURE__ */ new Map();
        super(s, o), this.#t.registry = o;
      }
      add(...s) {
        const o = s.pop();
        for (const t of s)
          this.#t.registry.set(t, o);
        return this.owner;
      }
    }(this), this.#e.types = new w(this);
  }
  /* TODO Use or kill. */
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
  /* Returns processors controller. 
  NOTE Operates on 'path.types'. */
  get processors() {
    return this.#e.processors;
  }
  /* Returns sources controller. 
  NOTE Operates on 'path.source'. */
  get sources() {
    return this.#e.sources;
  }
  /* Returns types controller
  NOTE Operates on 'path.type'. */
  get types() {
    return this.#e.types;
  }
  /* Injects asset. 
  NOTE Useful for
  - manually making objects use-importable (only do when  really necessary)
  - overloading asset when testing parcels (knock yourself out!). */
  add(e, s) {
    return this.#e.added.set(e, s), this;
  }
  /* Defines getter. */
  compose(e, s) {
    return Object.defineProperty(this, e, {
      configurable: !0,
      enumerable: !1,
      get() {
        return s;
      }
    }), this;
  }
  /* Returns asset.
  NOTE 
  - Import engine centerpiece.
  - "Standard" flow:
    1. Get asset text from source as per registered source handler.
    2. Transform asset text to asset as per registered type handler.
    3. Process (apply) asset as per registered processor.
  - "Non-standard" flow examples:
    - Source handler does all the work and skips transformations and processing;
      especially relevant for public assets, which can be applied as "hypermedia".
    - Arguments instructs return of raw asset (asset text).
    - Path-specific asset injected, which ignores source handlers;
      useful for testing.
  */
  async get(e, ...s) {
    const o = { ...s.find((l) => g(l) === "Object") || {} };
    s = s.filter((l) => g(l) !== "Object");
    const t = y.create(e);
    let c;
    if (this.#e.added.has(t.full) ? (c = this.#e.added.get(t.full), typeof c == "function" && (c = await c({ path: t }))) : (this.sources.has(t.source) || p.raise(`Invalid source: ${t.source}`), c = await this.sources.get(t.source)(
      { options: { ...o }, owner: this, path: t },
      ...s
    )), t.detail.escape || c instanceof Error) return c;
    if (o.raw)
      return o.spec ? Object.freeze({
        path: t.full,
        source: t.source,
        text: c,
        type: t.type
      }) : c;
    if (t.detail.transform !== !1 && this.types.has(t.type)) {
      const r = await this.types.get(t.type)(
        c,
        { options: { ...o }, owner: this, path: t },
        ...s
      );
      r !== void 0 && (c = r);
    }
    if (t.detail.process !== !1 && this.processors.has(t.types)) {
      const r = await this.processors.get(t.types)(
        c,
        { options: { ...o }, owner: this, path: t },
        ...s
      );
      r !== void 0 && (c = r);
    }
    return c;
  }
  /* Native import */
  async import(e) {
    return this.#e.import(e);
  }
  /* Returns uncached constructed module.
  NOTE Provided as a service to handlers. */
  async module(e, s) {
    s && (e = `${e}
//# sourceURL=${s}`);
    const o = URL.createObjectURL(
      new Blob([e], { type: "text/javascript" })
    ), t = await this.import(o);
    return URL.revokeObjectURL(o), t;
  }
}(), h = new Proxy(async () => {
}, {
  get(i, e) {
    if (e === "assets")
      return m;
    const s = m[e];
    return typeof s == "function" ? s.bind(m) : s;
  },
  set(i, e, s) {
    return m[e] = s, !0;
  },
  apply(i, e, s) {
    return m.get(...s);
  }
});
Object.defineProperty(globalThis, "use", {
  configurable: m.meta.DEV,
  enumerable: !0,
  writable: m.meta.DEV,
  value: h
});
h.types.add(
  "css",
  /* @__PURE__ */ (() => {
    const i = /* @__PURE__ */ new Map();
    return async (e, { path: s }) => {
      if (typeof e != "string") return;
      const { Sheet: o } = await h("@/rollo/"), t = s.full;
      if (i.has(t)) return i.get(t);
      const c = o.create(e, t);
      return i.set(t, c), c;
    };
  })()
).processors.add("css", async (i, e, ...s) => {
  if (g(i) !== "CSSStyleSheet") return;
  const o = s.filter(
    (t) => g(t) === "HTMLDocument" || t instanceof ShadowRoot || t.shadowRoot
  );
  o.length && i.use(...o);
});
h.processors.add(
  "html",
  "template",
  async (i, { options: e, owner: s, path: o }) => {
    if (!e.convert || typeof i != "string") return;
    const { component: t } = await h("@/rollo/");
    return t.from(i);
  }
);
(() => {
  const i = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  h.types.add("js", async (s, { options: o, owner: t, path: c }) => {
    if (typeof s != "string") return;
    let l;
    const { as: r } = o, n = r === "function" ? `${c.full}?${r}` : c.full;
    if (i.has(n))
      return i.get(n);
    if (e.has(n)) {
      const a = await e.get(n);
      return e.delete(n), a;
    } else {
      const { promise: f, resolve: a, reject: u } = Promise.withResolvers();
      e.set(n, f);
      try {
        return r === "function" ? (l = Function(`return ${s}`)(), l === void 0 && (l = null)) : l = await t.module(
          `export const __path__ = "${c.path}";${s}`,
          c.path
        ), a(l), i.set(n, l), l;
      } catch (d) {
        throw u(d), d;
      } finally {
        e.delete(n);
      }
    }
  });
})();
h.types.add("json", (i) => {
  if (typeof i == "string")
    return JSON.parse(i);
});
(() => {
  const i = /* @__PURE__ */ new Map();
  h.types.add("md", async (e, { options: s, owner: o, path: t }) => {
    if (s.raw) return;
    if (s.cache !== !1 && i.has(t.full))
      return i.get(t.full);
    if (typeof e != "string") return;
    const { marked: c } = await h("@/marked");
    let l;
    if (e.startsWith("---")) {
      const { YAML: r } = await h("@/yaml"), [n, f] = e.split("---").slice(1), a = Object.freeze(r.parse(n)), u = c.parse(f);
      l = Object.freeze({ meta: a, html: u });
    } else
      l = c.parse(e);
    return s.cache !== !1 && i.set(t.full, l), l;
  });
})();
(() => {
  const i = /* @__PURE__ */ new Map();
  h.processors.add("x.html", "x.template", async (e, { path: s }) => {
    if (typeof e != "string") return;
    const { component: o, Sheet: t } = await h("@/rollo/");
    if (i.has(s.full)) return i.get(s.full);
    const c = o.div({ innerHTML: e }), l = await h.module(
      `export const __path__ = "${s.path}";${c.querySelector("script").textContent.trim()}`,
      s.path
    ), r = Object.fromEntries(
      Object.entries(l).filter(([a, u]) => u instanceof HTMLElement)
    ), n = {};
    for (const a of c.querySelectorAll("style")) {
      if (a.hasAttribute("for")) {
        const u = a.getAttribute("for"), d = t.create(
          `[uid="${r[u].uid}"] { ${a.textContent.trim()} }`
        );
        a.hasAttribute("global") && d.use(), a.hasAttribute("name") && (n[a.getAttribute("name")] = d);
        continue;
      }
      if (a.hasAttribute("global")) {
        const u = t.create(a.textContent.trim()).use();
        a.hasAttribute("name") && (n[a.getAttribute("name")] = u);
      } else
        n[a.hasAttribute("name") ? a.getAttribute("name") : "__sheet__"] = t.create(a.textContent.trim());
    }
    for (const a of c.querySelectorAll("template"))
      n[a.hasAttribute("name") ? a.getAttribute("name") : "__template__"] = a.innerHTML.trim();
    Object.freeze(n);
    const f = { __type__: "Module", assets: n };
    for (const [a, u] of Object.entries(l)) {
      if (typeof u == "function") {
        if (a === "setup") {
          await u.call(n, n);
          continue;
        }
        f[a] = u.bind(n);
        continue;
      }
      f[a] = u;
    }
    return i.set(s.full, Object.freeze(f)), f;
  });
})();
window.dispatchEvent(new CustomEvent("_use"));
(() => {
  const i = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  h.sources.add("/", async ({ options: s, owner: o, path: t }) => {
    const { as: c, raw: l } = s;
    if (t.type === "css" && c === void 0 && l !== !0) {
      h.meta.DEV && await h(t.path, { raw: !0 });
      const r = `${o.meta.base}${t.path}`;
      let n = document.head.querySelector(
        `link[rel="stylesheet"][href="${r}"]`
      );
      if (n)
        return e.has(r) ? e.get(r) : n;
      n = document.createElement("link"), n.rel = "stylesheet", n.href = r;
      const { promise: f, resolve: a, reject: u } = Promise.withResolvers();
      return e.set(r, f), n.addEventListener(
        "load",
        (d) => {
          a(n), e.delete(r);
        },
        { once: !0 }
      ), n.addEventListener(
        "error",
        (d) => {
          e.delete(r), u(new p(`Failed to load sheet: ${r}`));
        },
        { once: !0 }
      ), document.head.append(n), await f;
    }
    if (t.type === "js" && l !== !0) {
      if (c === "script") {
        const r = `${o.meta.base}${t.path}`;
        let n = document.head.querySelector(`script[src="${r}"]`);
        if (n)
          return e.has(r) ? e.get(r) : !0;
        n = document.createElement("script"), n.src = r;
        const { promise: f, resolve: a, reject: u } = Promise.withResolvers();
        return e.set(r, f), n.addEventListener(
          "load",
          (d) => {
            e.delete(r), a(!0);
          },
          { once: !0 }
        ), n.addEventListener(
          "error",
          (d) => {
            e.delete(r), u(new p(`Failed to load script: ${r}`));
          },
          { once: !0 }
        ), document.head.append(n), await f;
      }
      if (c === void 0)
        return await o.import(`${o.meta.base}${t.path}`);
    }
    if (i.has(t.full))
      return i.get(t.full);
    if (e.has(t.full)) {
      const n = await e.get(t.full);
      return e.delete(t.full), n;
    } else {
      const { promise: r, resolve: n, reject: f } = Promise.withResolvers();
      e.set(t.full, r);
      try {
        const a = (await (await fetch(`${o.meta.base}${t.path}`, {
          cache: "no-store"
        })).text()).trim(), u = document.createElement("div");
        return u.innerHTML = a, u.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), i.set(t.full, a), n(a), a;
      } catch (a) {
        throw f(a), a;
      } finally {
        e.delete(t.full);
      }
    }
  });
})();
(() => {
  const i = /* @__PURE__ */ new Map();
  h.sources.add("@", ({ path: e }) => {
    if (i.has(e.full))
      return i.get(e.full);
    const s = document.createElement("meta");
    document.head.append(s), s.setAttribute("__path__", e.path);
    const o = getComputedStyle(s).getPropertyValue("--__asset__").trim();
    s.remove(), o || p.raise(`Invalid path: ${e.full}`);
    const t = atob(o.slice(1, -1));
    return i.set(e.full, t), t;
  });
})();
export {
  p as UseError,
  m as assets,
  h as default
};

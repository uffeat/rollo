const b = {}, y = (a) => Object.prototype.toString.call(a).slice(8, -1);
class p extends Error {
  static raise = (e, s) => {
    throw s?.(), new p(e);
  };
  static if = (e, s, n) => {
    typeof e == "function" && (e = e()), e && p.raise(s, n);
  };
  constructor(e) {
    super(e), this.name = "UseError";
  }
}
class g {
  static create = (e) => e instanceof g ? e : new g(e);
  #e = {
    detail: {}
  };
  constructor(e) {
    this.#e.specifier = e;
    const [s, n] = e.split("?");
    n ? this.#e.query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(n), ([l, r]) => {
          if (r = r.trim(), r === "") return [l, !0];
          if (r === "true") return [l, !0];
          const i = Number(r);
          return [l, Number.isNaN(i) ? r : i];
        }).filter(([l, r]) => !["false", "null", "undefined"].includes(r))
      )
    ) : this.#e.query = null;
    let t = s.split("/");
    if (this.#e.source = t.shift(), t.at(-1) === "" && (t[t.length - 1] = `${t[t.length - 2]}.js`), t.includes("")) {
      const l = t.findIndex((i) => i === ""), r = t[l + 1];
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
const m = new class {
  #e = {
    added: /* @__PURE__ */ new Map(),
    detail: {},
    /* Rebuild native 'import' to prevent Vite from barking */
    import: Function("u", "return import(u)")
  };
  constructor() {
    this.#e.meta = new class {
      #t = {
        detail: {}
      };
      constructor() {
        const s = "3869", n = "https://rolloh.vercel.app";
        this.#t.VITE = typeof import.meta < "u" && typeof b < "u" && "production", this.#t.DEV = location.hostname === "localhost", this.#t.env = this.#t.DEV ? "development" : "production", this.#t.embedded = window !== window.parent, this.#t.companion = new class {
          #s = {};
          constructor(t) {
            this.#s.owner = t, this.#s.owner.embedded ? this.#s.origin = window.parent.location.origin : this.#s.origin = this.#s.owner.DEV ? "https://rollohdev.anvil.app" : "https://rolloh.anvil.app";
          }
          get origin() {
            return this.#s.origin;
          }
        }(this), this.embedded ? this.#t.base = n : this.DEV ? location.port === s ? this.#t.base = "" : this.#t.base = `http://localhost:${s}` : this.origin === this.companion.origin ? this.#t.base = n : this.#t.base = "";
      }
      get DEV() {
        return this.#t.DEV;
      }
      /* Returns flag that indicates if running in Vite env. */
      get VITE() {
        return this.#t.VITE;
      }
      get base() {
        return this.#t.base;
      }
      set base(s) {
        this.#t.base = s;
      }
      get companion() {
        return this.#t.companion;
      }
      get detail() {
        return this.#t.detail;
      }
      get embedded() {
        return this.#t.embedded;
      }
      get env() {
        return this.#t.env;
      }
      get origin() {
        return location.origin;
      }
    }(), this.#e.sources = new w(this), this.#e.processors = new class extends w {
      #t = {};
      constructor(s) {
        const n = /* @__PURE__ */ new Map();
        super(s, n), this.#t.registry = n;
      }
      add(...s) {
        const n = s.pop();
        for (const t of s)
          this.#t.registry.set(t, n);
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
    const n = { ...s.find((l) => y(l) === "Object") || {} };
    s = s.filter((l) => y(l) !== "Object");
    const t = g.create(e);
    let c;
    if (this.#e.added.has(t.full) ? (c = this.#e.added.get(t.full), typeof c == "function" && (c = await c({ path: t }))) : (this.sources.has(t.source) || p.raise(`Invalid source: ${t.source}`), c = await this.sources.get(t.source)(
      { options: { ...n }, owner: this, path: t },
      ...s
    )), t.detail.escape || c instanceof Error) return c;
    if (n.raw)
      return n.spec ? Object.freeze({
        path: t.full,
        source: t.source,
        text: c,
        type: t.type
      }) : c;
    if (t.detail.transform !== !1 && this.types.has(t.type)) {
      const r = await this.types.get(t.type)(
        c,
        { options: { ...n }, owner: this, path: t },
        ...s
      );
      r !== void 0 && (c = r);
    }
    if (t.detail.process !== !1 && this.processors.has(t.types)) {
      const r = await this.processors.get(t.types)(
        c,
        { options: { ...n }, owner: this, path: t },
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
    const n = URL.createObjectURL(
      new Blob([e], { type: "text/javascript" })
    ), t = await this.import(n);
    return URL.revokeObjectURL(n), t;
  }
}(), h = new Proxy(async () => {
}, {
  get(a, e) {
    if (e === "assets")
      return m;
    const s = m[e];
    return typeof s == "function" ? s.bind(m) : s;
  },
  set(a, e, s) {
    return m[e] = s, !0;
  },
  apply(a, e, s) {
    return m.get(...s);
  }
});
Object.defineProperty(globalThis, "use", {
  configurable: m.meta.DEV,
  enumerable: !0,
  writable: m.meta.DEV,
  value: h
});
(() => {
  const a = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  h.sources.add("/", async ({ options: s, owner: n, path: t }) => {
    const { as: c, raw: l } = s;
    if (t.type === "css" && c === void 0 && l !== !0) {
      h.meta.DEV && await h(t.path, { raw: !0 });
      const r = `${n.meta.base}${t.path}`;
      let i = document.head.querySelector(
        `link[rel="stylesheet"][href="${r}"]`
      );
      if (i)
        return e.has(r) ? e.get(r) : i;
      i = document.createElement("link"), i.rel = "stylesheet", i.href = r;
      const { promise: f, resolve: o, reject: u } = Promise.withResolvers();
      return e.set(r, f), i.addEventListener(
        "load",
        (d) => {
          o(i), e.delete(r);
        },
        { once: !0 }
      ), i.addEventListener(
        "error",
        (d) => {
          e.delete(r), u(new p(`Failed to load sheet: ${r}`));
        },
        { once: !0 }
      ), document.head.append(i), await f;
    }
    if (t.type === "js" && l !== !0) {
      if (c === "script") {
        const r = `${n.meta.base}${t.path}`;
        let i = document.head.querySelector(`script[src="${r}"]`);
        if (i)
          return e.has(r) ? e.get(r) : !0;
        i = document.createElement("script"), i.src = r;
        const { promise: f, resolve: o, reject: u } = Promise.withResolvers();
        return e.set(r, f), i.addEventListener(
          "load",
          (d) => {
            e.delete(r), o(!0);
          },
          { once: !0 }
        ), i.addEventListener(
          "error",
          (d) => {
            e.delete(r), u(new p(`Failed to load script: ${r}`));
          },
          { once: !0 }
        ), document.head.append(i), await f;
      }
      if (c === void 0)
        return await n.import(`${n.meta.base}${t.path}`);
    }
    if (a.has(t.full))
      return a.get(t.full);
    if (e.has(t.full)) {
      const i = await e.get(t.full);
      return e.delete(t.full), i;
    } else {
      const { promise: r, resolve: i, reject: f } = Promise.withResolvers();
      e.set(t.full, r);
      try {
        const o = (await (await fetch(`${n.meta.base}${t.path}`, {
          cache: "no-store"
        })).text()).trim(), u = document.createElement("div");
        return u.innerHTML = o, u.querySelector("meta[index]") && p.raise(`Invalid path: ${t.full}`), a.set(t.full, o), i(o), o;
      } catch (o) {
        throw f(o), o;
      } finally {
        e.delete(t.full);
      }
    }
  });
})();
(() => {
  const a = /* @__PURE__ */ new Map();
  h.sources.add("@", ({ path: e }) => {
    if (a.has(e.full))
      return a.get(e.full);
    const s = document.createElement("meta");
    document.head.append(s), s.setAttribute("__path__", e.path);
    const n = getComputedStyle(s).getPropertyValue("--__asset__").trim();
    s.remove(), n || p.raise(`Invalid path: ${e.full}`);
    const t = atob(n.slice(1, -1));
    return a.set(e.full, t), t;
  });
})();
h.types.add(
  "css",
  /* @__PURE__ */ (() => {
    const a = /* @__PURE__ */ new Map();
    return async (e, { path: s }) => {
      if (typeof e != "string") return;
      const { Sheet: n } = await h("@/rollo/"), t = s.full;
      if (a.has(t)) return a.get(t);
      const c = n.create(e, t);
      return a.set(t, c), c;
    };
  })()
).processors.add("css", async (a, e, ...s) => {
  if (y(a) !== "CSSStyleSheet") return;
  const n = s.filter(
    (t) => y(t) === "HTMLDocument" || t instanceof ShadowRoot || t.shadowRoot
  );
  n.length && a.use(...n);
});
h.processors.add(
  "html",
  "template",
  async (a, { options: e, owner: s, path: n }) => {
    if (!e.convert || typeof a != "string") return;
    const { component: t } = await h("@/rollo/");
    return t.from(a);
  }
);
(() => {
  const a = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  h.types.add("js", async (s, { options: n, owner: t, path: c }) => {
    if (typeof s != "string") return;
    let l;
    const { as: r } = n, i = r === "function" ? `${c.full}?${r}` : c.full;
    if (a.has(i))
      return a.get(i);
    if (e.has(i)) {
      const o = await e.get(i);
      return e.delete(i), o;
    } else {
      const { promise: f, resolve: o, reject: u } = Promise.withResolvers();
      e.set(i, f);
      try {
        return r === "function" ? (l = Function(`return ${s}`)(), l === void 0 && (l = null)) : l = await t.module(
          `export const __path__ = "${c.path}";${s}`,
          c.path
        ), o(l), a.set(i, l), l;
      } catch (d) {
        throw u(d), d;
      } finally {
        e.delete(i);
      }
    }
  });
})();
h.types.add("json", (a) => {
  if (typeof a == "string")
    return JSON.parse(a);
});
(() => {
  const a = /* @__PURE__ */ new Map();
  h.types.add("md", async (e, { options: s, owner: n, path: t }) => {
    if (s.raw) return;
    if (s.cache !== !1 && a.has(t.full))
      return a.get(t.full);
    if (typeof e != "string") return;
    const { marked: c } = await h("@/marked");
    let l;
    if (e.startsWith("---")) {
      const { YAML: r } = await h("@/yaml"), [i, f] = e.split("---").slice(1), o = Object.freeze(r.parse(i)), u = c.parse(f);
      l = Object.freeze({ meta: o, html: u });
    } else
      l = c.parse(e);
    return s.cache !== !1 && a.set(t.full, l), l;
  });
})();
(() => {
  const a = /* @__PURE__ */ new Map();
  h.processors.add("x.html", "x.template", async (e, { path: s }) => {
    if (typeof e != "string") return;
    const { component: n, Sheet: t } = await h("@/rollo/");
    if (a.has(s.full)) return a.get(s.full);
    const c = n.div({ innerHTML: e }), l = await h.module(
      `export const __path__ = "${s.path}";${c.querySelector("script").textContent.trim()}`,
      s.path
    ), r = Object.fromEntries(
      Object.entries(l).filter(([o, u]) => u instanceof HTMLElement)
    ), i = {};
    for (const o of c.querySelectorAll("style")) {
      if (o.hasAttribute("for")) {
        const u = o.getAttribute("for"), d = t.create(
          `[uid="${r[u].uid}"] { ${o.textContent.trim()} }`
        );
        o.hasAttribute("global") && d.use(), o.hasAttribute("name") && (i[o.getAttribute("name")] = d);
        continue;
      }
      if (o.hasAttribute("global")) {
        const u = t.create(o.textContent.trim()).use();
        o.hasAttribute("name") && (i[o.getAttribute("name")] = u);
      } else
        i[o.hasAttribute("name") ? o.getAttribute("name") : "__sheet__"] = t.create(o.textContent.trim());
    }
    for (const o of c.querySelectorAll("template"))
      i[o.hasAttribute("name") ? o.getAttribute("name") : "__template__"] = o.innerHTML.trim();
    Object.freeze(i);
    const f = { __type__: "Module", assets: i };
    for (const [o, u] of Object.entries(l)) {
      if (typeof u == "function") {
        if (o === "setup") {
          await u.call(i, i);
          continue;
        }
        f[o] = u.bind(i);
        continue;
      }
      f[o] = u;
    }
    return a.set(s.full, Object.freeze(f)), f;
  });
})();
window.dispatchEvent(new CustomEvent("_use"));
export {
  p as UseError,
  m as assets,
  h as default
};

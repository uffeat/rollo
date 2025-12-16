const _ = (n) => Object.prototype.toString.call(n).slice(8, -1), Qt = _, A = new class {
  arrow = (n) => typeof n == "function" && !n.hasOwnProperty("prototype") && n.toString().includes("=>");
  callable(n) {
    return typeof n == "function" || n === "object" && n.call;
  }
  /* Checks if valid HTML element child. */
  child(n) {
    return n instanceof Node || ["number", "string"].includes(typeof n);
  }
  /* Tests if a value is a class (excluding plain functions). */
  esclass(n) {
    if (typeof n != "function") return !1;
    try {
      return n(), !1;
    } catch (t) {
      return t instanceof TypeError;
    }
  }
  /* Checks if ES Module. */
  esmodule(n) {
    return Object.getPrototypeOf(n) === null;
  }
  instance(n, ...t) {
    return t.includes(_(n));
  }
  integer(n) {
    return typeof n == "number" && Number.isInteger(n);
  }
  number(n) {
    return typeof n == "number" && !Number.isNaN(n);
  }
  /* Checks if string value contains only digits - allowing for a single 
  decimal mark ('.' or ',') and a leading '-'. Also allows null and ''. */
  numeric(n) {
    return n === null || n === "" ? !0 : /^-?\d*[.,]?\d*$/.test(n);
  }
  primitive(n) {
    return n == null || ["bigint", "boolean", "number", "string", "symbol"].includes(typeof n);
  }
  proxy(n) {
    try {
      return typeof n == "object" && n !== null && !Object.isExtensible(n);
    } catch {
      return !0;
    }
  }
  /* Checks if a function is declared with the `async` keyword. */
  async(n) {
    return typeof n == "function" && n.toString().startsWith("async ");
  }
}(), x = new class {
  if(t, e, s) {
    typeof t == "function" && (t = t()), t && this.raise(e, s);
  }
  raise(t, e) {
    throw e?.(), new Error(t);
  }
}();
class S {
  static create = (...t) => new S(...t);
  #t = {
    index: null
  };
  constructor(t) {
    this.#t.owner = t;
  }
  get detail() {
    return this.#t.detail;
  }
  set detail(t) {
    this.#t.detail = t;
  }
  get effect() {
    return this.#t.effect;
  }
  set effect(t) {
    this.#t.effect = t;
  }
  get index() {
    return this.#t.index;
  }
  set index(t) {
    this.#t.index = t;
  }
  get owner() {
    return this.#t.owner;
  }
  get stopped() {
    return this.#t.stopped;
  }
  stop() {
    this.#t.stopped = !0;
  }
}
class z {
  static create = (...t) => new z(...t);
  #t = {
    detail: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(...t) {
    this.#t.effects = new class {
      #e = {};
      constructor(d, f) {
        this.#e.owner = d, this.#e.registry = f;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(d, ...f) {
        const a = (() => {
          const y = f.find((p) => typeof p == "function");
          if (y)
            return y;
          const w = f.find((p) => Array.isArray(p));
          if (w)
            return (p) => w.includes(p);
        })(), {
          data: m = {},
          once: b,
          run: E = !0
        } = f.find((y, w) => !w && _(y) === "Object") || {}, j = (() => {
          const y = { data: { ...m } };
          return a && (y.condition = a), b && (y.once = b), y;
        })();
        if (this.#e.registry.set(d, j), E) {
          const y = S.create(this.#e.owner);
          y.detail = j, y.effect = d, (!a || a(this.#e.owner.current, y)) && d(this.#e.owner.current, y);
        }
        return d;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(d) {
        return this.#e.registry.has(d);
      }
      remove(d) {
        this.#e.registry.delete(d);
      }
    }(this, this.#t.registry);
    const e = t.find((l, d) => !d && _(l) !== "Object"), s = t.find((l) => _(l) === "Object") || {}, {
      detail: r,
      match: i = function(l) {
        return this.current === l;
      },
      name: o,
      owner: c
    } = s, u = t.filter((l) => A.arrow(l)), h = t.filter((l) => !A.arrow(l) && typeof l == "function");
    this.match = i, this.#t.name = o, this.#t.owner = c, Object.assign(this.detail, r), this.update(e);
    for (const l of u)
      this.effects.add(l);
    for (const l of h)
      l.call(this);
  }
  get current() {
    return this.#t.current;
  }
  set current(t) {
    this.update(t);
  }
  get detail() {
    return this.#t.detail;
  }
  get effects() {
    return this.#t.effects;
  }
  get match() {
    return this.#t.match;
  }
  set match(t) {
    t !== void 0 && (this.#t.match = t.bind(this));
  }
  get name() {
    return this.#t.name;
  }
  get owner() {
    return this.#t.owner;
  }
  get previous() {
    return this.#t.previous;
  }
  get session() {
    return this.#t.session;
  }
  /* Updates current reactively.
  NOTE 
  - Option for updating value silently, i.e., non-reactively. */
  update(t, { detail: e, silent: s = !1 } = {}, ...r) {
    if (e && Object.assign(this.detail, e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, s) return this;
    if (!this.effects.size) return this;
    const i = S.create(this);
    let o = 0;
    for (const [c, u] of this.#t.registry.entries()) {
      i.detail = u, i.effect = c, i.index = o++;
      const { condition: h, once: l } = u;
      if ((!h || h(this.current, i, ...r)) && (c(this.current, i, ...r), l && this.effects.remove(c, ...r), i.stopped))
        break;
    }
    return this;
  }
}
class O {
  static create = (...t) => new O(...t);
  #t = {
    change: Object.freeze({}),
    current: {},
    detail: {},
    previous: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(...t) {
    const e = this;
    this.#t.$ = new Proxy(() => {
    }, {
      get(f, a) {
        return a === "effects" ? e.effects : a in e && typeof e[a] == "function" ? e[a].bind(e) : e.#t.current[a];
      },
      set(f, a, m) {
        return x.if(
          a === "effects" || a in e && typeof e[a] == "function",
          `Reserved key: ${a}.`
        ), e.update({ [a]: m }), !0;
      },
      apply(f, a, m) {
        return e.update(...m);
      },
      deleteProperty(f, a) {
        e.update({ [a]: void 0 });
      },
      has(f, a) {
        return a in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(a, ...m) {
        const {
          data: b,
          once: E = !1,
          run: j = !0
        } = m.find((g, C) => !C && _(g) === "Object") || {}, y = m.filter((g) => A.arrow(g)), w = m.filter(
          (g) => !A.arrow(g) && typeof g == "function"
        ), p = z.create({ owner: e }), L = e.effects.add(
          (g, C) => {
            p.update(a(g, C));
          },
          { data: b, once: E, run: j }
        );
        this.#e.registry.set(p, L);
        for (const g of y)
          p.effects.add(g, { once: E, run: j });
        for (const g of w)
          g.call(p);
        return p;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (a, m) => a === m
      };
      get match() {
        return this.#e.match;
      }
      set match(a) {
        a !== void 0 && (this.#e.match = a);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(a, m) {
        this.#e.owner = a, this.#e.registry = m;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(a, ...m) {
        const b = (() => {
          const p = m.find((g) => typeof g == "function");
          if (p)
            return p;
          const L = m.find((g) => Array.isArray(g));
          if (L)
            return (g) => {
              for (const C of L)
                if (C in g)
                  return !0;
              return !1;
            };
        })(), {
          data: E = {},
          once: j,
          run: y = !0
        } = m.find((p) => _(p) === "Object") || {}, w = (() => {
          const p = { data: { ...E } };
          return b && (p.condition = b), j && (p.once = j), p;
        })();
        if (this.#e.registry.set(a, w), y) {
          const p = S.create(this.#e.owner);
          p.detail = w, p.effect = a, (!b || b(this.#e.owner.current, p)) && a(this.#e.owner.current, p);
        }
        return a;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(a) {
        return this.#e.registry.has(a);
      }
      remove(a) {
        this.#e.registry.delete(a);
      }
    }(this, this.#t.registry);
    const s = {
      ...t.find((f, a) => !a && _(f) === "Object") || {}
    }, r = t.find((f, a) => a && _(f) === "Object") || {}, { config: i = {}, detail: o, name: c, owner: u } = r, { match: h } = i, l = t.filter((f) => A.arrow(f)), d = t.filter((f) => !A.arrow(f) && typeof f == "function");
    this.#t.owner = u, this.#t.name = c, Object.assign(this.detail, o), this.config.match = h, this.update(s);
    for (const f of l)
      this.effects.add(f);
    for (const f of d)
      f.call(this);
  }
  /* Alternative API with leaner syntax */
  get $() {
    return this.#t.$;
  }
  get computed() {
    return this.#t.computed;
  }
  get config() {
    return this.#t.config;
  }
  get change() {
    return this.#t.change;
  }
  get current() {
    return Object.freeze({ ...this.#t.current });
  }
  set current(t) {
    this.clear(), this.update(t);
  }
  get detail() {
    return this.#t.detail;
  }
  get effects() {
    return this.#t.effects;
  }
  get name() {
    return this.#t.name;
  }
  get owner() {
    return this.#t.owner;
  }
  get previous() {
    return Object.freeze({ ...this.#t.previous });
  }
  get size() {
    return Object.keys(this.#t.current).length;
  }
  get session() {
    return this.#t.session;
  }
  clear(t = !1) {
    const e = this.keys().map((s) => [s, void 0]);
    return this.update(e, { silent: t });
  }
  copy() {
    return O.create(
      { ...this.#t.current },
      { config: { match: this.config.match }, detail: { ...this.detail } }
    );
  }
  entries() {
    return Object.entries(this.#t.current);
  }
  filter(t, e = !1) {
    const s = {};
    for (const [r, i] of this.entries())
      t([r, i]) || (s[r] = void 0);
    return this.update(s, { silent: e });
  }
  forEach(t) {
    return this.entries().forEach(t), this;
  }
  has(t) {
    return t in this.#t.current;
  }
  map(t, e = !1) {
    const s = this.entries().map(t);
    return this.update(s, { silent: e });
  }
  /* Tests if other contains the same non-undefined items as current.
  NOTE Does not participate in reactivity, but useful extra, especially for testing. */
  match(t) {
    if (t instanceof O)
      t = t.current;
    else if (_(t) === "Object")
      t = Object.fromEntries(
        Object.entries(t).filter(([e, s]) => s !== void 0)
      );
    else
      return !1;
    if (this.size !== Object.keys(t).length) return !1;
    for (const [e, s] of this.entries())
      if (!this.config.match(t[e], s)) return !1;
    return !0;
  }
  keys() {
    return Object.keys(this.#t.current);
  }
  values() {
    return Object.values(this.#t.current);
  }
  /* Updates current reactively. 
  - Option for updating silently, i.e., non-reactively. */
  update(...t) {
    let e = t.find((u, h) => !h);
    if (!e)
      return this;
    const { detail: s, silent: r = !1 } = t.find((u, h) => h && _(u) === "Object") || {};
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof O ? e = e.current : e = { ...e }, s && Object.assign(this.detail, { ...s });
    const i = {};
    for (const [u, h] of Object.entries(e))
      if (!this.config.match(h, this.#t.current[u])) {
        if (h === void 0) {
          u in this.#t.current && (i[u] = h, this.#t.previous[u] = this.#t.current[u], delete this.#t.current[u]);
          continue;
        }
        i[u] = h, this.#t.previous[u] = this.#t.current[u], this.#t.current[u] = h;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const o = S.create(this);
    let c = 0;
    for (const [u, h] of this.#t.registry.entries()) {
      o.detail = h, o.effect = u, o.index = c++;
      const { condition: l, once: d } = h;
      if ((!l || l(this.change, o)) && (u(this.change, o), d && this.effects.remove(u), o.stopped))
        break;
    }
    return this;
  }
}
const Xt = (...n) => O.create(...n).$, rt = (...n) => {
  const t = z.create(...n);
  return new Proxy(() => {
  }, {
    get(e, s) {
      x.if(!(s in t), `Invalid key: ${s}`);
      const r = t[s];
      return typeof r == "function" ? r.bind(t) : r;
    },
    set(e, s, r) {
      return x.if(!(s in t), `Invalid key: ${s}`), t[s] = r, !0;
    },
    apply(e, s, r) {
      return t.update(...r), t.current;
    }
  });
}, G = "$", nt = G.length, N = (n) => class extends n {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = O.create({ owner: this }), this.#t.state.effects.add(
      (t, e) => {
        this.update(t);
        const s = Object.fromEntries(
          Object.entries(t).filter(([r, i]) => !(r in this && !r.startsWith("_")) && !(r in this.style) && !r.startsWith("[") && !r.startsWith("data.") && !r.startsWith(".") && !r.startsWith("__") && !r.startsWith("on.")).map(([r, i]) => [`state-${r}`, i])
        );
        this.attributes.update(s);
      },
      { run: !1 }
    );
  }
  get $() {
    return this.#t.state.$;
  }
  get effects() {
    return this.#t.state.effects;
  }
  get name() {
    return this.attribute.name;
  }
  set name(t) {
    this.attribute.name = t;
  }
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    t && (this.attribute.owner = t.uid ? t.uid : !0), this.#t.owner = t;
  }
  get state() {
    return this.#t.state;
  }
  update(t = {}) {
    return super.update?.(t), this.$(
      Object.fromEntries(
        Object.entries(t).filter(([e, s]) => e.startsWith(G)).map(([e, s]) => [e.slice(nt), s])
      )
    ), this;
  }
}, te = (n) => class extends n {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = z.create({ owner: this }), this.#t.ref.effects.add(
      (t, e) => {
        this.attribute.current = t, this.attribute.previous = this.previous, this.attribute.session = this.session, this.send("_ref", { detail: Object.freeze({ current: t, message: e }) });
      },
      { run: !1 }
    );
  }
  get current() {
    return this.#t.ref.current;
  }
  set current(t) {
    this.#t.ref.update(t);
  }
  get effects() {
    return this.#t.ref.effects;
  }
  get name() {
    return this.attribute.name;
  }
  set name(t) {
    this.attribute.name = t;
  }
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    t && (this.attribute.owner = t.uid ? t.uid : !0), this.#t.owner = t;
  }
  get previous() {
    return this.#t.ref.previous;
  }
  get ref() {
    return this.#t.ref;
  }
  get session() {
    return this.#t.ref.session;
  }
};
class it {
  #t = {};
  constructor(t) {
    this.#t.args = t;
  }
  /* Returns children. */
  get children() {
    return this.#t.children === void 0 && (this.#t.children = this.#t.args.filter((t) => t instanceof HTMLElement)), this.#t.children;
  }
  /* Returns CSS classes */
  get classes() {
    return this.#t.classes === void 0 && (this.#t.classes = this.#t.args.find(
      (t, e) => !e && typeof t == "string"
    ), this.#t.classes && (this.#t.classes = this.#t.classes.split(" ").map((t) => t.trim()).filter((t) => !!t).join("."))), this.#t.classes;
  }
  /* Returns hooks. */
  get hooks() {
    return this.#t.hooks === void 0 && (this.#t.hooks = this.#t.args.filter((t) => typeof t == "function"), this.#t.hooks.length || (this.#t.hooks = null)), this.#t.hooks;
  }
  /* Returns text. */
  get text() {
    return this.#t.text === void 0 && (this.#t.text = this.#t.args.find((t, e) => e && typeof t == "string")), this.#t.text;
  }
  /* Returns updates. */
  get updates() {
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((t, e) => _(t) === "Object") || {}), this.#t.updates;
  }
}
const q = (n) => (...t) => {
  t = new it(t);
  const e = typeof n == "function" ? new n(t) : n;
  if (e.constructor.__new__?.call(e, t), e.__new__?.(t), e.classes && e.classes.add(t.classes), e.update?.(t.updates), t.text && e.insertAdjacentText("afterbegin", t.text), e.append?.(...t.children), e.__init__?.(t), e.constructor.__init__?.call(e, t), t.hooks) {
    const s = [];
    t.hooks.forEach((r) => {
      const i = r.call(e, e);
      typeof i == "function" && s.push(i);
    }), s.length && setTimeout(() => {
      s.forEach((r) => r.call(e, e));
    }, 0);
  }
  return e;
}, I = (n, t, ...e) => {
  let s = n;
  for (const r of e)
    s = r(s, t, ...e);
  return s;
}, ot = (n, t) => class extends n {
  static __name__ = "append";
  /* Appends children. Chainable. */
  append(...e) {
    return Array.isArray(e.at(0)) ? super.append(...e.at(0)) : super.append(...e), this;
  }
  /* Prepends children. Chainable. */
  prepend(...e) {
    return super.prepend(...e), this;
  }
};
function $(n, { numbers: t = !1 } = {}) {
  return t ? String(n).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(n).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function ee(n) {
  return n.length ? n[0].toUpperCase() + n.slice(1) : n;
}
function se(n) {
  return String(n).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase());
}
function re(n) {
  return String(n).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase()).replace(/^([a-z])/, (t, e) => e.toUpperCase());
}
function ne(n) {
  return n.replaceAll("-", "_");
}
function ie(n) {
  return n.length ? n[0].toLowerCase() + n.slice(1) : n;
}
function oe(n, { numbers: t = !1 } = {}) {
  return t ? String(n).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase() : String(n).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase();
}
const ct = (n, t) => class extends n {
  static __name__ = "attrs";
  #t = {};
  constructor() {
    super();
    const e = this, s = super.attributes;
    this.#t.attributes = new class {
      /* Returns attributes NamedNodeMap (for advanced use). */
      get attributes() {
        return s;
      }
      get owner() {
        return e;
      }
      /* Returns number of set attributes. */
      get size() {
        return s.length;
      }
      /* Returns attribute entries. */
      entries() {
        return Array.from(s, (i) => [
          i.name,
          this.#e(i.value)
        ]);
      }
      /* Returns attribute value. */
      get(i) {
        if (i = $(i), !e.hasAttribute(i))
          return null;
        const o = e.getAttribute(i);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(i) {
        return i = $(i), e.hasAttribute(i);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(s, (i) => i.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(i, o) {
        if (i = $(i), o === void 0)
          return e;
        const c = this.#e(e.getAttribute(i));
        return o === c || ([!1, null].includes(o) ? e.removeAttribute(i) : o === !0 || !["number", "string"].includes(typeof o) ? e.setAttribute(i, "") : e.setAttribute(i, o), e.dispatchEvent(
          new CustomEvent("_attributes", {
            detail: Object.freeze({ name: i, current: o, previous: c })
          })
        )), e;
      }
      /* Updates one or more attribute values. Chainable with respect to component. */
      update(i = {}) {
        return Object.entries(i).forEach(([o, c]) => {
          this.set(o, c);
        }), e;
      }
      /* Returns attribute values (interpreted). */
      values() {
        return Array.from(s, (i) => i.value);
      }
      #e(i) {
        if (i === "")
          return !0;
        if (i === null)
          return i;
        const o = Number(i);
        return isNaN(o) ? i || !0 : o;
      }
    }(), this.#t.attribute = new Proxy(this, {
      get(r, i) {
        return r.attributes.get(i);
      },
      set(r, i, o) {
        return r.attributes.set(i, o), !0;
      }
    });
  }
  attributeChangedCallback(e, s, r) {
    super.attributeChangedCallback?.(e, s, r), this.dispatchEvent(
      new CustomEvent("_attribute", {
        detail: Object.freeze({ name: e, previous: s, current: r })
      })
    );
  }
  /* Provides access to single attribute without use of strings. */
  get attribute() {
    return this.#t.attribute;
  }
  /* Return attributes controller. */
  get attributes() {
    return this.#t.attributes;
  }
  /* Updates attributes from '[]'-syntax. Chainable. */
  update(e = {}) {
    return super.update?.(e), this.attributes.update(
      Object.fromEntries(
        Object.entries(e).filter(([s, r]) => s.startsWith("[") && s.endsWith("]")).map(([s, r]) => [s.slice(1, -1), r])
      )
    ), this;
  }
};
class at {
  #t = {};
  constructor(t) {
    this.#t.owner = t;
  }
  get owner() {
    return this.#t.owner;
  }
  /* Returns classList (for advanced use). */
  get list() {
    return this.owner.classList;
  }
  get size() {
  }
  /* Adds classes. */
  add(t) {
    const e = this.#e(t);
    return this.owner.classList.add(...e), this.owner;
  }
  /* Removes all classes. */
  clear() {
    for (const t of Array.from(owner.classList))
      this.owner.classList.remove(t);
    return this.owner.removeAttribute("class"), this.owner;
  }
  /* Checks, if classes are present. */
  has(t) {
    const e = this.#e(t);
    for (const s of e)
      if (!this.owner.classList.contains(s))
        return !1;
    return !0;
  }
  /* Adds/removes classes according to condition. */
  if(t, e) {
    return this[t ? "add" : "remove"](e), this.owner;
  }
  /* Removes classes. */
  remove(t) {
    const e = this.#e(t);
    return this.owner.classList.remove(...e), this.owner;
  }
  /* Replaces current with substitutes. 
        NOTE
        - If mismatch between 'current' and 'substitutes' sizes, substitutes are (intentionally) 
        silently ignored. */
  replace(t, e) {
    t = this.#e(t), e = this.#e(e);
    for (let s = 0; s < t.length; s++) {
      const r = e.at(s);
      if (r)
        this.owner.classList.replace(t[s], r);
      else
        break;
    }
    return this.owner;
  }
  /* Toggles classes. */
  toggle(t, e) {
    const s = this.#e(t);
    for (const r of s)
      this.owner.classList.toggle(r, e);
    return this.owner;
  }
  values() {
  }
  #e(t) {
    if (t) {
      const e = t.includes(".") ? "." : " ";
      return t.split(e).map((s) => s.trim()).filter((s) => !!s);
    }
    return [];
  }
}
const ut = (n, t) => class extends n {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new at(this), this.#t.class = new Proxy(
      () => {
      },
      {
        get(s, r) {
          e.classes.add(r);
        },
        set(s, r, i) {
          return e.classes[i ? "add" : "remove"](r), !0;
        },
        apply(s, r, i) {
        }
      }
    );
  }
  get class() {
    return this.#t.class;
  }
  /* Returns controller for managing CSS classes from a string.
  The string can be '.'- or ' '-separated. For Tailwind detection, use ' '
  -separation. To escape Tailwind detection, use '.'-separation, incl.
  leading '.'.
   */
  get classes() {
    return this.#t.classes;
  }
  /* Updates CSS classes from '.'-syntax. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, r] of Object.entries(e))
      s.startsWith(".") && (r === void 0 || r === "..." || this.classes[r ? "add" : "remove"](s));
    return this;
  }
}, ht = (n, t) => class extends n {
  static __name__ = "clear";
  /* Clears content, optionally subject to selector. Chainable. */
  clear(e) {
    if (e)
      for (const s of Array.from(this.children))
        s.matches(e) && s.remove();
    else {
      for (; this.firstElementChild; )
        this.firstElementChild.remove();
      this.innerHTML = "";
    }
    return this;
  }
}, ft = (n, t) => class extends n {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, lt = 5, dt = (n, t) => class extends n {
  static __name__ = "data";
  #t = {};
  constructor() {
    super(), this.#t.data = new Proxy(this, {
      get(e, s) {
        return e.attributes.get(`data-${s}`);
      },
      set(e, s, r) {
        return e.attributes.set(`data-${s}`, r), !0;
      }
    });
  }
  /* Provides access to single data attribute without use of strings. */
  get data() {
    return this.#t.data;
  }
  /* Updates attributes from 'data.'-syntax. */
  update(e = {}) {
    return super.update?.(e), this.attributes.update(
      Object.fromEntries(
        Object.entries(e).filter(([s, r]) => s.startsWith("data.")).map(([s, r]) => [`data-${s.slice(lt)}`, r])
      )
    ), this;
  }
}, pt = (n, t) => class extends n {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, _t = (n, t) => class extends n {
  static __name__ = "find";
  /* Unified alternative to 'querySelector' and 'querySelectorAll' 
  with a leaner syntax. */
  find(e) {
    const s = this.querySelectorAll(e);
    return s.length === 1 ? s[0] : s.length ? s.values() : null;
  }
  search(e) {
    const s = this.querySelectorAll(e) || null;
    if (s)
      return s.values();
  }
}, gt = (n, t) => class extends n {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
}, mt = (n, t) => class extends n {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class yt {
  #t = {};
  constructor(t) {
    this.#t.owner = t;
  }
  /* Inserts elements/html fragments 'afterbegin'. Chainable with respect to component. */
  afterbegin(...t) {
    return t.reverse().forEach((e) => {
      e && this.#t.owner[typeof e == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterbegin", e);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'afterend'. Chainable with respect to component. */
  afterend(...t) {
    return t.reverse().forEach((e) => {
      e && this.#t.owner[typeof e == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterend", e);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'beforebegin'. Chainable with respect to component. */
  beforebegin(...t) {
    return t.forEach((e) => {
      e && this.#t.owner[typeof e == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforebegin", e);
    }), this.#t.owner;
  }
  /* Inserts  elements/html fragments 'beforeend'. Chainable with respect to component. */
  beforeend(...t) {
    return t.forEach((e) => {
      e && this.#t.owner[typeof e == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforeend", e);
    }), this.#t.owner;
  }
}
const bt = (n, t, ...e) => class extends n {
  static __name__ = "insert";
  #t = {};
  __new__(...s) {
    super.__new__?.(...s), this.#t.insert = new yt(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, wt = (n, t) => class extends n {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(e) {
    e ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
};
class Z {
  static create = (...t) => new Z(...t);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  constructor(t) {
    t && (this.#t.registry = t);
  }
  get __registry__() {
    return this.#t.registry;
  }
  get tags() {
    return Array.from(this.#t.registry.keys());
  }
  add(t, e) {
    if (this.#t.registry.has(t))
      this.#t.registry.get(t).add(e);
    else {
      const s = /* @__PURE__ */ new Set();
      s.add(e), this.#t.registry.set(t, s);
    }
  }
  clear(t) {
    this.#t.registry.has(t) && (this.#t.registry.get(t).clear(), this.#t.registry.delete(t));
  }
  has(t, e) {
    return this.#t.registry.has(t) ? this.#t.registry.get(t).has(e) : !1;
  }
  remove(t, e) {
    if (this.#t.registry.has(t)) {
      const s = this.#t.registry.get(t);
      s.delete(e), s.size || this.#t.registry.delete(t);
    }
  }
  size(t) {
    return this.#t.registry.has(t) ? this.#t.registry.get(t).size : null;
  }
  values(t) {
    if (this.#t.registry.has(t)) {
      const e = this.#t.registry.get(t);
      return Array.from(e.values());
    }
  }
}
const ae = (n, t, e, {
  bind: s = !0,
  configurable: r = !0,
  enumerable: i = !0,
  writable: o = !0
} = {}) => (s && (e = e.bind(n)), Object.defineProperty(n, t, {
  configurable: r,
  enumerable: i,
  writable: o,
  value: e
}), n), ue = (n, t, { bind: e = !0, configurable: s = !0, enumerable: r = !1, get: i, set: o } = {}) => {
  e && (i = i.bind(n));
  const c = {
    configurable: s,
    enumerable: r,
    get: i
  };
  return o && (e && (o = o.bind(n)), c.set = o), Object.defineProperty(n, t, c), n;
}, T = (n, t, e, {
  bind: s = !0,
  configurable: r = !1,
  enumerable: i = !0,
  writable: o = !1
} = {}) => (s && e.bind && (e = e.bind(n)), Object.defineProperty(n, t, {
  configurable: r,
  enumerable: i,
  writable: o,
  value: e
}), n), vt = 3;
class xt {
  #t = {};
  constructor(t) {
    this.#t.registry = Z.create(), this.#t.owner = t;
  }
  get types() {
    return this.#t.registry.tags;
  }
  add(t, e) {
    this.#t.registry.has(t, e) || this.#t.registry.add(t, e);
  }
  clear(t) {
    const e = this.#t.registry.values(t);
    if (e) {
      for (const s of e)
        this.#t.owner.removeEventListener(t, s);
      this.#t.registry.clear(t);
    }
  }
  has(t, e) {
    return this.#t.registry.has(t, e);
  }
  remove(t, e) {
    this.#t.registry.has(t, e) && this.#t.registry.remove(t, e);
  }
  size(t) {
    return this.#t.registry.size(t);
  }
}
const jt = (n, t) => class extends n {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const s = this;
    this.#t.registry = new xt(this);
    const r = new class {
      get types() {
        return s.#t.registry.types;
      }
      clear(i) {
        return s.#t.registry.clear(i);
      }
      has(i, o) {
        return s.#t.registry.has(i, o);
      }
      size(i) {
        return s.#t.registry.size(i);
      }
    }();
    this.#t.on = new Proxy(() => {
    }, {
      get(i, o) {
        if (o === "registry")
          return r;
        const c = o;
        return new Proxy(() => {
        }, {
          /* Enable syntax like:
          button.on.click((event) => console.log("Clicked"));
          button.on.click({ once: true }, (event) => console.log("Clicked"));
          button.on.click.use((event) => console.log("Clicked"));
          button.on.click.unuse((event) => console.log("Clicked"));
          NOTE
          `button.on.click()` and `button.on.click.use()` do exactly the same 
          thing ans as such the 'use' part is redundant. However, does create 
          symmetry with respect to handler by 'unuse':
          `button.on.click.unuse()`
          */
          get(u, h) {
            return (...l) => {
              const d = l.find((a) => typeof a == "function"), f = l.find((a) => _(a) === "Object") || {};
              if (h === "use")
                return s.addEventListener(c, d, f);
              if (h === "unuse")
                return s.removeEventListener(c, d, f);
              throw new Error(`Invalid key: ${h}`);
            };
          },
          apply(u, h, l) {
            const d = l.find((a) => typeof a == "function"), f = l.find((a) => _(a) === "Object") || {};
            return s.addEventListener(c, d, f);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(i, o, c) {
        const [u, ...h] = o.split(".");
        return s.addEventListener(
          u,
          c,
          Object.fromEntries(h.map((l) => [l, !0]))
        ), !0;
      },
      /* Enable syntax like:
      button.on({ click: (event) => console.log("Clicked") });
      button.on({ once: true }, { click: (event) => console.log("Clicked") });
      button.on("click", (event) => console.log("Clicked"));
      button.on("click", (event) => console.log("Clicked"), { once: true });
      */
      apply(i, o, c) {
        return s.addEventListener(...c);
      }
    });
  }
  /* Adds event handler with the special on-syntax. */
  get on() {
    return this.#t.on;
  }
  /* Registers event handler.
  Overloads original 'addEventListener'. Does not break original API, but 
  handles additional options, returns an object that can be used for later 
  dereg or chaining and enables object-based args. "Point-of-truth" event 
  handler registration.
  NOTE 
  - If 'once' AND 'run', the handler will run twice.
  - Attempts to track once-handlers are silently ignored
  */
  addEventListener(...s) {
    const [r, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], {
      once: o = !1,
      run: c = !1,
      track: u = !1,
      ...h
    } = s.find((d, f) => f && _(d) === "Object") || {};
    u && !o && this.#t.registry.add(r, i), super.addEventListener(r, i, { once: o, ...h });
    const l = {
      handler: i,
      once: o,
      remove: () => {
        this.removeEventListener(r, i, { track: u });
      },
      run: c,
      target: this,
      track: u,
      type: r,
      ...h
    };
    if (c) {
      const d = this.constructor.create();
      d.addEventListener(
        r,
        (f) => {
          T(f, "currentTarget", this), T(f, "target", this), T(f, "noevent", !0), i(f, l);
        },
        { once: !0 }
      ), r.startsWith("_") || r.includes("-") ? d.dispatchEvent(new CustomEvent(r)) : `on${r}` in d && r in d && typeof d[r] == "function" ? d[r]() : d.dispatchEvent(new Event(r));
    }
    return l;
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options makes chainable and enables object-based args.
  "Point-of-truth" event handler deregistration. */
  removeEventListener(...s) {
    const [r, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], { track: o = !1, ...c } = s.find((u, h) => h && _(u) === "Object") || {};
    return o && this.#t.registry.remove(r, i), super.removeEventListener(r, i, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(s = {}) {
    super.update?.(s);
    for (const [r, i] of Object.entries(s))
      if (r.startsWith("on.")) {
        const [o, ...c] = r.slice(vt).split("."), u = Object.fromEntries(c.map((h) => [h, !0]));
        this.addEventListener(o, i, u);
      }
    return this;
  }
}, $t = (n, t) => class extends n {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(e) {
    this.#t.owner = e, this.attribute && (this.attribute = e && "uid" in e ? e.uid : e);
  }
}, Ot = (n, t) => class extends n {
  static __name__ = "parent";
  #t = {};
  /* Returns parent. */
  get parent() {
    return this.parentElement;
  }
  /* Appends component to parent or removes component. */
  set parent(e) {
    e !== void 0 && e !== this.parentElement && (e === null ? this.remove() : e.append(this));
  }
  get __parent__() {
    return this.#t.parent;
  }
  set __parent__(e) {
    this.#t.parent = e;
  }
  update(e = {}) {
    return super.update?.(e), e.__parent__ && (this.__parent__ = e.__parent__), this;
  }
  __init__() {
    super.__init__?.(), this.__parent__ && (this.parent = this.__parent__);
  }
}, Et = (n, t) => class extends n {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, r] of Object.entries(e))
      s.startsWith("__") || !(s in this) && !s.startsWith("_") || r !== void 0 && this[s] !== r && (this[s] = r);
    return this;
  }
}, At = (n, t) => class extends n {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(e, { detail: s, trickle: r, ...i } = {}) {
    const o = s === void 0 ? new Event(e, i) : new CustomEvent(e, { detail: s, ...i });
    if (this.dispatchEvent(o), r) {
      const c = typeof r == "string" ? this.querySelectorAll(r) : this.children;
      for (const u of c)
        u.dispatchEvent(o);
    }
    return o;
  }
}, St = (n, t) => class extends n {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, r] of Object.entries(e))
      s in this || s in this.style && r !== void 0 && (r === null ? r = "none" : r === 0 && (r = "0"), this.style[s] !== r && (this.style[s] = r));
    return this;
  }
}, Ct = (n, t, ...e) => class extends n {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const s = (i) => super[i], r = (i, o) => {
      super[i] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(i, o) {
        return s(o);
      },
      set(i, o, c) {
        return r(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, Pt = (n, t) => class extends n {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, zt = (n, t) => class extends n {
  static __name__ = "text";
  /* Returns text content. */
  get text() {
    return this.textContent || null;
  }
  /* Sets text content. */
  set text(e) {
    this.textContent = e;
  }
};
let Lt = 0;
const Rt = (n, t) => class extends n {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e), this.setAttribute("uid", `uid${Lt++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, Tt = (n, t) => class extends n {
  static __name__ = "vars";
  #t = {};
  constructor() {
    super(), this.#t.__ = new Proxy(this, {
      get(e, s) {
        if (s.startsWith("--") || (s = `--${s}`), e.isConnected) {
          const o = getComputedStyle(e).getPropertyValue(s).trim();
          if (!o) return !1;
          const c = e.style.getPropertyPriority(s);
          return c ? `${o} !${c}` : o === "none" ? null : o;
        }
        const r = e.style.getPropertyValue(s);
        if (!r) return !1;
        const i = e.style.getPropertyPriority(s);
        return i ? `${r} !${i}` : r === "none" ? null : r;
      },
      set(e, s, r) {
        if (s.startsWith("--") || (s = `--${s}`), r === null ? r = "none" : r === 0 && (r = "0"), r === void 0)
          return !0;
        const i = e.__[s];
        return r === i || (r === !1 ? e.style.removeProperty(s) : typeof r == "string" ? (r = r.trim(), r.endsWith("!important") ? e.style.setProperty(
          s,
          r.slice(0, -10),
          "important"
        ) : e.style.setProperty(s, r)) : e.style.setProperty(s, r)), !0;
      }
    });
  }
  /* Provides access to single CSS var without use of strings. */
  get __() {
    return this.#t.__;
  }
  /* Updates CSS vars from '__'-syntax. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, r] of Object.entries(e))
      s.endsWith("__") || s.startsWith("__") && (this.__[s.slice(2)] = r);
    return this;
  }
}, Mt = 9, Wt = -3, M = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": ot,
        "./mixins/attrs.js": ct,
        "./mixins/classes.js": ut,
        "./mixins/clear.js": ht,
        "./mixins/connect.js": ft,
        "./mixins/data.js": dt,
        "./mixins/detail.js": pt,
        "./mixins/find.js": _t,
        "./mixins/for_.js": gt,
        "./mixins/hook.js": mt,
        "./mixins/insert.js": bt,
        "./mixins/novalidation.js": wt,
        "./mixins/on.js": jt,
        "./mixins/owner.js": $t,
        "./mixins/parent.js": Ot,
        "./mixins/props.js": Et,
        "./mixins/send.js": At,
        "./mixins/style.js": St,
        "./mixins/super_.js": Ct,
        "./mixins/tab.js": Pt,
        "./mixins/text.js": zt,
        "./mixins/uid.js": Rt,
        "./mixins/vars.js": Tt
      })
    ).map(([n, t]) => [n.slice(Mt, Wt), t])
  )
), H = (...n) => {
  const t = n.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = n.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), s = n.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const r = Object.entries(M).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
  return r.push(...s), r;
}, W = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(n, t, e) {
    t ? Object.defineProperty(n, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = n.__key__, e ? Object.defineProperty(n, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: e
    }) : e = n.__native__;
    const s = [t, n];
    return e && s.push({ extends: e }), customElements.define(...s), this.#t.registry.set(t, n), n;
  }
  get(n) {
    return this.#t.registry.get(n);
  }
  has(n) {
    return this.#t.registry.has(n);
  }
  values() {
    return this.#t.registry.values();
  }
}(), Y = (n, t, e) => (W.add(n, t, e), T(n, "create", q(n)), n.create), kt = (n) => {
  const t = `x-${n}`;
  if (W.has(t))
    return W.get(t);
  const e = document.createElement(n), s = e.constructor;
  if (s === HTMLUnknownElement)
    throw new Error(`'${n}' is not native.`);
  const r = H("!text", N);
  return "textContent" in e && r.push(M.text), n === "form" && r.push(M.novalidation), n === "label" && r.push(M.for_), W.add(
    class B extends I(s, {}, ...r) {
      static __key__ = t;
      static __native__ = n;
      static create = (...o) => {
        const c = new B();
        return q(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, Nt = (n) => {
  const t = kt(n), e = new t();
  return q(e);
}, k = new Proxy(
  {},
  {
    get(n, t) {
      return Nt(t);
    }
  }
), V = "div", qt = Y(
  class extends I(
    document.createElement(V).constructor,
    {},
    ...H(N)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = k.slot(), this.#t.dataSlot = k.slot({ name: "data", display: null }), this.#t.shadow = k.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  V
), P = qt({ id: "app", parent: document.body }), It = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});
for (const [n, t] of Object.entries(It)) {
  const e = window.matchMedia(`(width >= ${t}px)`), s = e.matches;
  P.$[n] = s, P.send(`_break_${n}`, { detail: s }), e.addEventListener("change", (r) => {
    const i = e.matches;
    P.$[n] = i, P.send(`_break_${n}`, { detail: i });
  });
}
const Zt = (n, t) => {
  if (_(n) !== "Object" || _(t) !== "Object" || ((() => {
    const e = ([s, r]) => r !== void 0;
    n = Object.fromEntries(Object.entries(n).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
  })(), Object.keys(n).length !== Object.keys(t).length)) return !1;
  for (const [e, s] of Object.entries(n))
    if (t[e] !== s) return !1;
  return !0;
}, Ht = new class {
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
}();
class U {
  static create = (...t) => new U(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = Ht.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && Zt(t.query, this.query);
  }
}
class Ut {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(...t) {
    const e = t.at(0), s = t.at(1);
    return t.at(2), this.#t.registry.set(e, { route: s }), this;
  }
  async get(t) {
    const e = this.#t.registry.get(t), s = e.route;
    if (!e.setup) {
      const r = s.page;
      r instanceof HTMLElement && r.attribute && (r.attribute.page = t), typeof s.setup == "function" && await s.setup(t), e.setup = !0;
    }
    return s;
  }
  has(t) {
    return this.#t.registry.has(t);
  }
  remove(t) {
    return this.#t.registry.delete(t);
  }
}
const v = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new Ut(), this.#t.states = {
      path: rt({ owner: this, name: "path" })
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
  async setup({ error: t, redirect: e, routes: s, strict: r = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = r, Object.assign(this.#t.config.redirect, e), s && this.routes.add({ ...s }), this.#t.initialized || (window.addEventListener("popstate", async (i) => {
      await this.use(this.#n(), {
        context: "pop"
      });
    }), await this.use(this.#n(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: e, strict: s } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), s = s === void 0 ? this.#t.config.strict : s;
    const r = U.create(t), i = this.#t.url ? r.match(this.#t.url) ? void 0 : (this.#t.url = r, () => {
      e || history.pushState({}, "", r.full);
    }) : (this.#t.url = r, () => {
      e || history.pushState({}, "", r.full);
    });
    if (!i)
      return this;
    this.#t.session++;
    const o = await (async () => {
      const { path: c, residual: u, route: h } = await this.#e(r.path) || {};
      if (!h) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#s(c, r.query, ...u), h === this.#t.route ? h.update && await h.update(
          { session: this.#t.session },
          r.query,
          ...u
        ) : (this.#t.route && this.#t.route.exit && await this.#t.route.exit({ session: this.#t.session }), h.enter && await h.enter(
          { session: this.#t.session },
          r.query,
          ...u
        ), this.#t.route = h);
      };
    })();
    if (!o) {
      if (i(), this.#s(r.path, r.query), s) {
        const c = `Invalid path: ${r.path}`;
        if (this.#t.config.error)
          this.#t.config.error(c);
        else
          throw new Error(c);
      }
      return this;
    }
    return i(), await o(), this;
  }
  async #e(t) {
    const e = t.slice(1).split("/");
    for (let s = e.length - 1; s >= 0; s--) {
      const r = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(r)) {
        const i = e.slice(s + 1), o = await this.routes.get(r);
        return { path: r, route: o, residual: i };
      }
    }
  }
  /* Enables external hooks etc. */
  #s(t, e, ...s) {
    s.length && (t = `${t}/${s.join("/")}`), P.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #n() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), J = new Proxy(async () => {
}, {
  get(n, t) {
    if (t === "router")
      return v;
    x.if(!(t in v), `Invalid key: ${t}`);
    const e = v[t];
    return typeof e == "function" ? e.bind(v) : e;
  },
  set(n, t, e) {
    return x.if(!(t in v), `Invalid key: ${t}`), v[t] = e, !0;
  },
  apply(n, t, e) {
    return v.use(...e);
  },
  deleteProperty(n, t) {
    v.routes.remove(t);
  },
  has(n, t) {
    return v.routes.has(t);
  }
}), Q = "a", de = Y(
  class extends I(
    document.createElement(Q).constructor,
    {},
    ...H(N)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (n) => {
        if (this.path) {
          n.preventDefault();
          const t = this.#t.query ? this.path + Query.stringify(this.#t.query) : this.path;
          await J(t);
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
  Q
), pe = (n) => (J.effects.add(
  (t) => {
    const e = n.find(".active");
    e && e.classes.remove("active");
    const s = n.find(`[path="${t}"]`);
    s && s.classes.add("active");
  },
  (t) => !!t
), n), Kt = (n, t = !0) => t ? n.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : n.replace(/\s/g, ""), X = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", X);
const tt = new X(), R = "@media";
class K {
  static create = (...t) => new K(...t);
  #t = {};
  constructor(t) {
    this.#t.owner = t;
  }
  /* Returns owner sheet. */
  get owner() {
    return this.#t.owner;
  }
  /* Returns number of current rules. */
  get size() {
    return this.owner.cssRules.length;
  }
  /* Returns text representation of current sheet. */
  get text() {
    return Array.from(
      this.owner.cssRules,
      (t) => Kt(t.cssText)
    ).join(" ");
  }
  /* Adds rules. */
  add(t) {
    for (const [e, s] of Object.entries(t))
      this.#e(this.owner, this.#i(e, s), s);
    return this;
  }
  /* Removes all rules. */
  clear() {
    for (; this.size; )
      this.owner.deleteRule(this.size - 1);
    return this;
  }
  /* Returns rule. */
  find(t) {
    return this.#s(this.owner, this.#i(t));
  }
  /* Removes rules. */
  remove(...t) {
    return this.#o(this.owner, ...t);
  }
  /* Updates or creates rules. */
  update(t) {
    for (let [e, s] of Object.entries(t)) {
      e = this.#i(e, s);
      const r = this.#s(this.owner, e);
      if (r) {
        if (r instanceof CSSStyleRule)
          this.#r(r, s);
        else if (r instanceof CSSMediaRule)
          for (const [i, o] of Object.entries(s)) {
            const c = this.#s(r, i);
            c ? this.#r(c, o) : this.#e(r, i, o);
          }
        else if (r instanceof CSSKeyframesRule)
          for (const [i, o] of Object.entries(s)) {
            const c = r.findRule(`${i}%`);
            c ? this.#r(c, o) : this.#e(r, selector, o);
          }
      } else
        this.#e(this.owner, e, s);
    }
    return this;
  }
  #e(t, e, s) {
    (!("cssRules" in t) || !("insertRule" in t)) && x.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const r = t.cssRules[t.insertRule(`${e} { }`, t.cssRules.length)];
    if (r instanceof CSSStyleRule)
      return this.#r(r, s);
    if (r instanceof CSSMediaRule) {
      for (const [i, o] of Object.entries(s))
        this.#e(r, i, o);
      return r;
    }
    if (r instanceof CSSKeyframesRule) {
      for (const [i, o] of Object.entries(s))
        r.appendRule(`${i}% { }`), this.#r(r.findRule(`${i}%`), o);
      return r;
    }
  }
  #s(t, e) {
    "cssRules" in t || x.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    return e.startsWith(R) ? (e = e.slice(R.length).trim(), s.filter((r) => r instanceof CSSMediaRule).find((r) => r.conditionText === e) || null) : s.filter((r) => r instanceof CSSStyleRule).find((r) => r.selectorText === e) || null;
  }
  #n(t) {
    const e = Number(Object.keys(t)[0]);
    return typeof e == "number" && !Number.isNaN(e);
  }
  #i(t, e) {
    return t.startsWith("max") ? `@media (width <= ${t.slice(3)}px)` : t.startsWith("min") ? `@media (width >= ${t.slice(3)}px)` : !t.startsWith("@keyframes") && e && this.#n(e) ? `@keyframes ${t}` : t;
  }
  #o(t, ...e) {
    (!("cssRules" in t) || !("deleteRule" in t)) && x.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    for (let r of e) {
      let i;
      r.startsWith(R) ? (r = r.slice(R.length).trim(), i = s.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === r)) : i = s.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === r), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #r(t, e = {}) {
    t instanceof CSSRule || x.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [s, r] of Object.entries(e))
      if (r !== void 0) {
        if (_(r) === "Object") {
          const [i, o] = Object.entries(r)[0];
          r = `${o}${i}`;
        }
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = $(s.trim())), r === !1) {
          t.style.removeProperty(s);
          continue;
        }
        if (!this.#c(s))
          throw new Error(`Invalid key: ${s}`);
        if (typeof r == "string") {
          r = r.trim(), r.endsWith("!important") ? t.style.setProperty(
            s,
            r.slice(0, -10),
            "important"
          ) : t.style.setProperty(s, r);
          continue;
        }
        r === null && (r = "none"), t.style.setProperty(s, r);
      }
    return t;
  }
  #c(t) {
    return t in tt.style || t.startsWith("--");
  }
}
class D {
  static create = (...t) => new D(...t);
  #t = { registry: /* @__PURE__ */ new Set() };
  constructor(t) {
    this.#t.owner = t;
  }
  /* Returns owner sheet. */
  get owner() {
    return this.#t.owner;
  }
  /* Returns number of targets. */
  get size() {
    return this.#t.registry.size;
  }
  /* Adopts owner sheet to target. */
  add(t) {
    this.has(t) || (this.#t.registry.add(t), t.adoptedStyleSheets.push(this.owner));
  }
  /* Checks, if target has adopted owner sheet. */
  has(t) {
    return this.#t.registry.has(t);
  }
  /* Unadopts owner sheet from target. */
  remove(t) {
    if (this.has(t)) {
      this.#t.registry.delete(t);
      const e = t.adoptedStyleSheets;
      for (let s = e.length - 1; s >= 0; s--)
        e[s] === this.owner && e.splice(s, 1);
    }
  }
}
const Dt = document.documentElement, F = new class {
  #t = {};
  constructor() {
    this.#t.color = new class {
      get hex() {
        return new Proxy(
          {},
          {
            get(n, t) {
              return `#${t}`;
            }
          }
        );
      }
    }();
  }
  get __() {
    return new Proxy(
      {},
      {
        get(n, t) {
          return `var(--${$(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(n, t) {
          return getComputedStyle(Dt).getPropertyValue(`--${$(t, { numbers: !0 })}`).trim();
        }
      }
    );
  }
  get color() {
    return this.#t.color;
  }
  get value() {
    return new Proxy(
      {},
      {
        get(n, t) {
          return $(t, { numbers: !0 });
        }
      }
    );
  }
  attr(n) {
    return `attr(${n})`;
  }
  important(...n) {
    return `${n.join(" ")} !important`;
  }
  rotate(n) {
    return `rotate(${n})`;
  }
}(), ge = new Proxy(() => {
}, {
  get(n, t) {
    return t in F ? F[t] : t in tt.style ? new Proxy(
      {},
      {
        get(e, s) {
          return { [t]: $(s, { numbers: !0 }) };
        }
      }
    ) : (e) => (t === "pct" && (t = "%"), `${e}${t}`);
  },
  apply(n, t, e) {
    return e = e.map((s) => s === "!" ? "!important" : s), e.join(" ");
  }
}), me = (n) => {
  let t = "";
  const e = new class {
    attrs(r) {
      for (const [i, o] of Object.entries(r))
        o === !0 ? t += `[${i}]` : t += `[${i}="${o}"]`;
    }
    child(r) {
      t += ` > ${r}`;
    }
    classes(...r) {
      for (const i of r)
        t += `.${i}`;
    }
    has(r) {
      t += `:has(${descendant})`;
    }
    in(r) {
      t += ` ${r}`;
    }
    is(r) {
      t += `:is(${descendant})`;
    }
    not(r) {
      t += `:not(${descendant})`;
    }
  }(), s = new Proxy(() => {
  }, {
    get(r, i) {
      if (i in e) {
        const o = e[i];
        if (typeof o == "function")
          return (...c) => (o(...c), s);
      }
      return i === "_" ? (t += " ", s) : (t += i, s);
    },
    apply(r, i, o) {
      const c = o[0];
      return _(c) === "Object" ? { [t]: c } : (t += c, s);
    }
  });
  return s;
}, ye = (n) => `[uid="${n.uid}"]`;
class et extends CSSStyleSheet {
  static create = (...t) => new et(...t);
  #t = {
    detail: {}
  };
  constructor(...t) {
    super(), this.#t.rules = K.create(this), this.#t.targets = D.create(this), this.#t.text = t.find((r, i) => !i && typeof r == "string"), this.#t.path = t.find((r, i) => i && typeof r == "string");
    const e = t.find((r) => _(r) === "Object"), s = t.find((r) => _(r) === "Object" && r !== e);
    this.text && this.replaceSync(this.text), e && this.rules.add(e), Object.assign(this.detail, s);
  }
  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#t.detail;
  }
  /* Returns path (if provided). Useful for soft identification. */
  get path() {
    return this.#t.path;
  }
  get rules() {
    return this.#t.rules;
  }
  /* Returns targets controller. */
  get targets() {
    return this.#t.targets;
  }
  /* Returns text representation of original sheet. */
  get text() {
    return this.#t.text;
  }
  disable() {
    return this.disabled = !0, this;
  }
  enable() {
    return this.disabled = !1, this;
  }
  /* Unadopts sheet from targets. */
  unuse(...t) {
    t.length || t.push(document);
    for (const e of t) {
      const s = e.shadowRoot || e;
      this.targets.remove(s);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...t) {
    t.length || t.push(document);
    for (const e of t) {
      const s = e.shadowRoot || e;
      this.targets.add(s);
    }
    return this;
  }
}
const be = (n, ...t) => (t.forEach(
  (e) => Object.defineProperties(
    n,
    Object.getOwnPropertyDescriptors(e.prototype)
  )
), n);
class st {
  static create = (...t) => new st(...t);
  #t = {
    detail: {},
    resolved: !1
  };
  constructor(...t) {
    const e = Promise.withResolvers();
    this.#t.promise = e.promise, this.#t.res = e.resolve;
    const { detail: s, name: r, owner: i } = t.find((o) => typeof o != "function") || {};
    Object.assign(this.detail, s), this.#t.name = r, this.#t.owner = i, this.#t.callback = t.find((o) => typeof o == "function") || null;
  }
  get detail() {
    return this.#t.detail;
  }
  get name() {
    return this.#t.name;
  }
  get owner() {
    return this.#t.owner;
  }
  get promise() {
    return this.#t.promise;
  }
  get resolved() {
    return this.#t.resolved;
  }
  get value() {
    return this.#t.value;
  }
  resolve(t) {
    if (this.resolved)
      throw new Error("Already resolved.");
    return this.#t.value = t, this.#t.resolved = !0, this.#t.res(t), this.#t.callback?.(t, {
      detail: this.detail,
      name: this.name,
      owner: this.owner
    }), this;
  }
}
function we(n, ...t) {
  const e = this === globalThis ? null : this, s = {
    context: e,
    data: {},
    pipe: t,
    size: t.length
  };
  for (const [r, i] of t.entries())
    s.index = r, s.self = i, n = i.call(e, n, s);
  return n;
}
function ve(n) {
  return new Promise((t) => setTimeout(t, n));
}
function Vt(n) {
  let t = n.parentElement;
  for (; t && t !== document.body; ) {
    const e = getComputedStyle(t), s = /(auto|scroll)/.test(e.overflowY), r = t.scrollHeight > t.clientHeight;
    if (s && r)
      return t;
    t = t.parentElement;
  }
  return window;
}
function xe(n) {
  Vt(n).scrollTo({ top: 0, behavior: "smooth" });
}
const je = (n, t, { abs: e = 1e-4, rel: s = 1e-6 } = {}) => {
  if (n === t) return !0;
  const r = Math.abs(n - t);
  return r <= e || r <= Math.max(Math.abs(n), Math.abs(t)) * s;
}, $e = (n, { decimals: t = 2, banker: e = !1 } = {}) => {
  const s = 10 ** t, r = n * s, i = Math.round(r);
  return e && Math.abs(r % 1) === 0.5 ? Math.floor(r / 2) * 2 / s : i / s;
};
export {
  x as Exception,
  st as Future,
  H as Mixins,
  pe as Nav,
  de as NavLink,
  O as Reactive,
  z as Ref,
  et as Sheet,
  P as app,
  be as assign,
  Y as author,
  It as breakpoints,
  $ as camelToKebab,
  ee as camelToPascal,
  k as component,
  ge as css,
  ae as defineMethod,
  ue as defineProperty,
  T as defineValue,
  ve as delay,
  q as factory,
  A as is,
  se as kebabToCamel,
  re as kebabToPascal,
  ne as kebabToSnake,
  je as matchNumber,
  Zt as matchObject,
  I as mix,
  M as mixins,
  ie as pascalToCamel,
  oe as pascalToKebab,
  we as pipe,
  Xt as reactive,
  rt as ref,
  te as refMixin,
  W as registry,
  $e as roundNumber,
  J as router,
  me as rule,
  ye as scope,
  N as stateMixin,
  xe as toTop,
  _ as type,
  Qt as typeName
};

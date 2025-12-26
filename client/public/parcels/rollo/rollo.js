const p = (r) => Object.prototype.toString.call(r).slice(8, -1), re = p, S = new class {
  arrow = (r) => typeof r == "function" && !r.hasOwnProperty("prototype") && r.toString().includes("=>");
  callable(r) {
    return typeof r == "function" || r === "object" && r.call;
  }
  /* Checks if valid HTML element child. */
  child(r) {
    return r instanceof Node || ["number", "string"].includes(typeof r);
  }
  /* Tests if a value is a class (excluding plain functions). */
  esclass(r) {
    if (typeof r != "function") return !1;
    try {
      return r(), !1;
    } catch (t) {
      return t instanceof TypeError;
    }
  }
  /* Checks if ES Module. */
  esmodule(r) {
    return Object.getPrototypeOf(r) === null;
  }
  instance(r, ...t) {
    return t.includes(p(r));
  }
  integer(r) {
    return typeof r == "number" && Number.isInteger(r);
  }
  number(r) {
    return typeof r == "number" && !Number.isNaN(r);
  }
  /* Checks if string value contains only digits - allowing for a single 
  decimal mark ('.' or ',') and a leading '-'. Also allows null and ''. */
  numeric(r) {
    return r === null || r === "" ? !0 : /^-?\d*[.,]?\d*$/.test(r);
  }
  primitive(r) {
    return r == null || ["bigint", "boolean", "number", "string", "symbol"].includes(typeof r);
  }
  proxy(r) {
    try {
      return typeof r == "object" && r !== null && !Object.isExtensible(r);
    } catch {
      return !0;
    }
  }
  /* Checks if a function is declared with the `async` keyword. */
  async(r) {
    return typeof r == "function" && r.toString().startsWith("async ");
  }
}(), x = new class {
  if(t, e, s) {
    typeof t == "function" && (t = t()), t && this.raise(e, s);
  }
  raise(t, e) {
    throw e?.(), new Error(t);
  }
}();
class z {
  static create = (...t) => new z(...t);
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
class L {
  static create = (...t) => new L(...t);
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
        const h = (() => {
          const y = f.find((_) => typeof _ == "function");
          if (y)
            return y;
          const j = f.find((_) => Array.isArray(_));
          if (j)
            return (_) => j.includes(_);
        })(), {
          data: m = {},
          once: w,
          run: $ = !0
        } = f.find((y, j) => !j && p(y) === "Object") || {}, O = (() => {
          const y = { data: { ...m } };
          return h && (y.condition = h), w && (y.once = w), y;
        })();
        if (this.#e.registry.set(d, O), $) {
          const y = z.create(this.#e.owner);
          y.detail = O, y.effect = d, (!h || h(this.#e.owner.current, y)) && d(this.#e.owner.current, y);
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
    const e = t.find((l, d) => !d && p(l) !== "Object"), s = t.find((l) => p(l) === "Object") || {}, {
      detail: n,
      match: i = function(l) {
        return this.current === l;
      },
      name: o,
      owner: c
    } = s, a = t.filter((l) => S.arrow(l)), u = t.filter((l) => !S.arrow(l) && typeof l == "function");
    this.match = i, this.#t.name = o, this.#t.owner = c, Object.assign(this.detail, n), this.update(e);
    for (const l of a)
      this.effects.add(l);
    for (const l of u)
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
  update(t, { detail: e, silent: s = !1 } = {}, ...n) {
    if (e && Object.assign(this.detail, e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, s) return this;
    if (!this.effects.size) return this;
    const i = z.create(this);
    let o = 0;
    for (const [c, a] of this.#t.registry.entries()) {
      i.detail = a, i.effect = c, i.index = o++;
      const { condition: u, once: l } = a;
      if ((!u || u(this.current, i, ...n)) && (c(this.current, i, ...n), l && this.effects.remove(c, ...n), i.stopped))
        break;
    }
    return this;
  }
}
class A {
  static create = (...t) => new A(...t);
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
      get(f, h) {
        return h === "effects" ? e.effects : h in e && typeof e[h] == "function" ? e[h].bind(e) : e.#t.current[h];
      },
      set(f, h, m) {
        return x.if(
          h === "effects" || h in e && typeof e[h] == "function",
          `Reserved key: ${h}.`
        ), e.update({ [h]: m }), !0;
      },
      apply(f, h, m) {
        return e.update(...m);
      },
      deleteProperty(f, h) {
        e.update({ [h]: void 0 });
      },
      has(f, h) {
        return h in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(h, ...m) {
        const {
          data: w,
          once: $ = !1,
          run: O = !0
        } = m.find((g, C) => !C && p(g) === "Object") || {}, y = m.filter((g) => S.arrow(g)), j = m.filter(
          (g) => !S.arrow(g) && typeof g == "function"
        ), _ = L.create({ owner: e }), P = e.effects.add(
          (g, C) => {
            _.update(h(g, C));
          },
          { data: w, once: $, run: O }
        );
        this.#e.registry.set(_, P);
        for (const g of y)
          _.effects.add(g, { once: $, run: O });
        for (const g of j)
          g.call(_);
        return _;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (h, m) => h === m
      };
      get match() {
        return this.#e.match;
      }
      set match(h) {
        h !== void 0 && (this.#e.match = h);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(h, m) {
        this.#e.owner = h, this.#e.registry = m;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(h, ...m) {
        const w = (() => {
          const _ = m.find((g) => typeof g == "function");
          if (_)
            return _;
          const P = m.find((g) => Array.isArray(g));
          if (P)
            return (g) => {
              for (const C of P)
                if (C in g)
                  return !0;
              return !1;
            };
        })(), {
          data: $ = {},
          once: O,
          run: y = !0
        } = m.find((_) => p(_) === "Object") || {}, j = (() => {
          const _ = { data: { ...$ } };
          return w && (_.condition = w), O && (_.once = O), _;
        })();
        if (this.#e.registry.set(h, j), y) {
          const _ = z.create(this.#e.owner);
          _.detail = j, _.effect = h, (!w || w(this.#e.owner.current, _)) && h(this.#e.owner.current, _);
        }
        return h;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(h) {
        return this.#e.registry.has(h);
      }
      remove(h) {
        this.#e.registry.delete(h);
      }
    }(this, this.#t.registry);
    const s = {
      ...t.find((f, h) => !h && p(f) === "Object") || {}
    }, n = t.find((f, h) => h && p(f) === "Object") || {}, { config: i = {}, detail: o, name: c, owner: a } = n, { match: u } = i, l = t.filter((f) => S.arrow(f)), d = t.filter((f) => !S.arrow(f) && typeof f == "function");
    this.#t.owner = a, this.#t.name = c, Object.assign(this.detail, o), this.config.match = u, this.update(s);
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
    return A.create(
      { ...this.#t.current },
      { config: { match: this.config.match }, detail: { ...this.detail } }
    );
  }
  entries() {
    return Object.entries(this.#t.current);
  }
  filter(t, e = !1) {
    const s = {};
    for (const [n, i] of this.entries())
      t([n, i]) || (s[n] = void 0);
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
    if (t instanceof A)
      t = t.current;
    else if (p(t) === "Object")
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
    let e = t.find((a, u) => !u);
    if (!e)
      return this;
    const { detail: s, silent: n = !1 } = t.find((a, u) => u && p(a) === "Object") || {};
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof A ? e = e.current : e = { ...e }, s && Object.assign(this.detail, { ...s });
    const i = {};
    for (const [a, u] of Object.entries(e))
      if (!this.config.match(u, this.#t.current[a])) {
        if (u === void 0) {
          a in this.#t.current && (i[a] = u, this.#t.previous[a] = this.#t.current[a], delete this.#t.current[a]);
          continue;
        }
        i[a] = u, this.#t.previous[a] = this.#t.current[a], this.#t.current[a] = u;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, n) return this;
    if (!this.effects.size) return this;
    const o = z.create(this);
    let c = 0;
    for (const [a, u] of this.#t.registry.entries()) {
      o.detail = u, o.effect = a, o.index = c++;
      const { condition: l, once: d } = u;
      if ((!l || l(this.change, o)) && (a(this.change, o), d && this.effects.remove(a), o.stopped))
        break;
    }
    return this;
  }
}
const ue = (...r) => A.create(...r).$, at = (...r) => {
  const t = L.create(...r);
  return new Proxy(() => {
  }, {
    get(e, s) {
      x.if(!(s in t), `Invalid key: ${s}`);
      const n = t[s];
      return typeof n == "function" ? n.bind(t) : n;
    },
    set(e, s, n) {
      return x.if(!(s in t), `Invalid key: ${s}`), t[s] = n, !0;
    },
    apply(e, s, n) {
      return t.update(...n), t.current;
    }
  });
}, J = "$", ut = J.length, H = (r) => class extends r {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = A.create({ owner: this }), this.#t.state.effects.add(
      (t, e) => {
        this.update(t);
        const s = Object.fromEntries(
          Object.entries(t).filter(([n, i]) => !(n in this && !n.startsWith("_")) && !(n in this.style) && !n.startsWith("[") && !n.startsWith("data.") && !n.startsWith(".") && !n.startsWith("__") && !n.startsWith("on.")).map(([n, i]) => [`state-${n}`, i])
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
        Object.entries(t).filter(([e, s]) => e.startsWith(J)).map(([e, s]) => [e.slice(ut), s])
      )
    ), this;
  }
}, he = (r) => class extends r {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = L.create({ owner: this }), this.#t.ref.effects.add(
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
class ht {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((t, e) => p(t) === "Object") || {}), this.#t.updates;
  }
}
const I = (r) => (...t) => {
  t = new ht(t);
  const e = typeof r == "function" ? new r(t) : r;
  if (e.constructor.__new__?.call(e, t), e.__new__?.(t), e.classes && e.classes.add(t.classes), e.update?.(t.updates), t.text && e.insertAdjacentText("afterbegin", t.text), e.append?.(...t.children), e.__init__?.(t), e.constructor.__init__?.call(e, t), t.hooks) {
    const s = [];
    t.hooks.forEach((n) => {
      const i = n.call(e, e);
      typeof i == "function" && s.push(i);
    }), s.length && setTimeout(() => {
      s.forEach((n) => n.call(e, e));
    }, 0);
  }
  return e;
}, Z = (r, t, ...e) => {
  let s = r;
  for (const n of e)
    s = n(s, t, ...e);
  return s;
}, ft = (r, t) => class extends r {
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
function E(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function fe(r) {
  return r.length ? r[0].toUpperCase() + r.slice(1) : r;
}
function le(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase());
}
function de(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase()).replace(/^([a-z])/, (t, e) => e.toUpperCase());
}
function pe(r) {
  return r.replaceAll("-", "_");
}
function _e(r) {
  return r.length ? r[0].toLowerCase() + r.slice(1) : r;
}
function ge(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase();
}
const lt = (r, t) => class extends r {
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
        if (i = E(i), !e.hasAttribute(i))
          return null;
        const o = e.getAttribute(i);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(i) {
        return i = E(i), e.hasAttribute(i);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(s, (i) => i.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(i, o) {
        if (i = E(i), o === void 0)
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
      get(n, i) {
        return n.attributes.get(i);
      },
      set(n, i, o) {
        return n.attributes.set(i, o), !0;
      }
    });
  }
  attributeChangedCallback(e, s, n) {
    super.attributeChangedCallback?.(e, s, n), this.dispatchEvent(
      new CustomEvent("_attribute", {
        detail: Object.freeze({ name: e, previous: s, current: n })
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
        Object.entries(e).filter(([s, n]) => s.startsWith("[") && s.endsWith("]")).map(([s, n]) => [s.slice(1, -1), n])
      )
    ), this;
  }
};
class dt {
  #t = {};
  constructor(t) {
    this.#t.owner = t;
  }
  get owner() {
    return this.#t.owner;
  }
  get size() {
    return this.owner.classList.length;
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
    return this.owner.classList.remove(...e), this.size || this.owner.removeAttribute("class"), this.owner;
  }
  /* Replaces current with substitutes. 
  NOTE
  - If mismatch between 'current' and 'substitutes' sizes, substitutes are (intentionally) 
  silently ignored. */
  replace(t, e) {
    t = this.#e(t), e = this.#e(e);
    for (let s = 0; s < t.length; s++) {
      const n = e.at(s);
      if (n)
        this.owner.classList.replace(t[s], n);
      else
        break;
    }
    return this.owner;
  }
  /* Toggles classes. */
  toggle(t, e) {
    const s = this.#e(t);
    for (const n of s)
      this.owner.classList.toggle(n, e);
    return this.owner;
  }
  #e(t) {
    if (t) {
      const e = t.includes(".") ? "." : " ";
      return t.split(e).map((s) => s.trim()).filter((s) => !!s);
    }
    return [];
  }
}
const pt = (r, t) => class extends r {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new dt(this), this.#t.class = new Proxy(() => {
    }, {
      get(s, n) {
        e.classes.add(n);
      },
      set(s, n, i) {
        return e.classes[i ? "add" : "remove"](n), !0;
      },
      apply(s, n, i) {
        console.error("Not yet implemented.");
      }
    });
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
    for (const [s, n] of Object.entries(e))
      s.startsWith(".") && (n === void 0 || n === "..." || this.classes[n ? "add" : "remove"](s));
    return this;
  }
}, _t = (r, t) => class extends r {
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
}, gt = (r, t) => class extends r {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, mt = 5, yt = (r, t) => class extends r {
  static __name__ = "data";
  #t = {};
  constructor() {
    super(), this.#t.data = new Proxy(this, {
      get(e, s) {
        return e.attributes.get(`data-${s}`);
      },
      set(e, s, n) {
        return e.attributes.set(`data-${s}`, n), !0;
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
        Object.entries(e).filter(([s, n]) => s.startsWith("data.")).map(([s, n]) => [`data-${s.slice(mt)}`, n])
      )
    ), this;
  }
}, bt = (r, t) => class extends r {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, wt = (r, t) => class extends r {
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
}, jt = (r, t) => class extends r {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
}, vt = (r, t) => class extends r {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class xt {
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
const Ot = (r, t, ...e) => class extends r {
  static __name__ = "insert";
  #t = {};
  __new__(...s) {
    super.__new__?.(...s), this.#t.insert = new xt(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, At = (r, t) => class extends r {
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
class U {
  static create = (...t) => new U(...t);
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
const ye = (r, t, e, {
  bind: s = !0,
  configurable: n = !0,
  enumerable: i = !0,
  writable: o = !0
} = {}) => (s && (e = e.bind(r)), Object.defineProperty(r, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), r), be = (r, t, { bind: e = !0, configurable: s = !0, enumerable: n = !1, get: i, set: o } = {}) => {
  e && (i = i.bind(r));
  const c = {
    configurable: s,
    enumerable: n,
    get: i
  };
  return o && (e && (o = o.bind(r)), c.set = o), Object.defineProperty(r, t, c), r;
}, k = (r, t, e, {
  bind: s = !0,
  configurable: n = !1,
  enumerable: i = !0,
  writable: o = !1
} = {}) => (s && e.bind && (e = e.bind(r)), Object.defineProperty(r, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), r), Et = 3;
class $t {
  #t = {};
  constructor(t) {
    this.#t.registry = U.create(), this.#t.owner = t;
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
const St = (r, t) => class extends r {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const s = this;
    this.#t.registry = new $t(this);
    const n = new class {
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
          return n;
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
          get(a, u) {
            return (...l) => {
              const d = l.find((h) => typeof h == "function"), f = l.find((h) => p(h) === "Object") || {};
              if (u === "use")
                return s.addEventListener(c, d, f);
              if (u === "unuse")
                return s.removeEventListener(c, d, f);
              throw new Error(`Invalid key: ${u}`);
            };
          },
          apply(a, u, l) {
            const d = l.find((h) => typeof h == "function"), f = l.find((h) => p(h) === "Object") || {};
            return s.addEventListener(c, d, f);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(i, o, c) {
        const [a, ...u] = o.split(".");
        return s.addEventListener(
          a,
          c,
          Object.fromEntries(u.map((l) => [l, !0]))
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
    const [n, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], {
      once: o = !1,
      run: c = !1,
      track: a = !1,
      ...u
    } = s.find((d, f) => f && p(d) === "Object") || {};
    a && !o && this.#t.registry.add(n, i), super.addEventListener(n, i, { once: o, ...u });
    const l = {
      handler: i,
      once: o,
      remove: () => {
        this.removeEventListener(n, i, { track: a });
      },
      run: c,
      target: this,
      track: a,
      type: n,
      ...u
    };
    if (c) {
      const d = this.constructor.create();
      d.addEventListener(
        n,
        (f) => {
          k(f, "currentTarget", this), k(f, "target", this), k(f, "noevent", !0), i(f, l);
        },
        { once: !0 }
      ), n.startsWith("_") || n.includes("-") ? d.dispatchEvent(new CustomEvent(n)) : `on${n}` in d && n in d && typeof d[n] == "function" ? d[n]() : d.dispatchEvent(new Event(n));
    }
    return l;
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options makes chainable and enables object-based args.
  "Point-of-truth" event handler deregistration. */
  removeEventListener(...s) {
    const [n, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], { track: o = !1, ...c } = s.find((a, u) => u && p(a) === "Object") || {};
    return o && this.#t.registry.remove(n, i), super.removeEventListener(n, i, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(s = {}) {
    super.update?.(s);
    for (const [n, i] of Object.entries(s))
      if (n.startsWith("on.")) {
        const [o, ...c] = n.slice(Et).split("."), a = Object.fromEntries(c.map((u) => [u, !0]));
        this.addEventListener(o, i, a);
      }
    return this;
  }
}, zt = (r, t) => class extends r {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(e) {
    this.#t.owner = e, this.attribute && (this.attribute = e && "uid" in e ? e.uid : e);
  }
}, Ct = (r, t) => class extends r {
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
}, Tt = (r, t) => class extends r {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, n] of Object.entries(e))
      s.startsWith("__") || !(s in this) && !s.startsWith("_") || n !== void 0 && this[s] !== n && (this[s] = n);
    return this;
  }
}, Lt = (r, t) => class extends r {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(e, { detail: s, trickle: n, ...i } = {}) {
    const o = s === void 0 ? new Event(e, i) : new CustomEvent(e, { detail: s, ...i });
    if (this.dispatchEvent(o), n) {
      const c = typeof n == "string" ? this.querySelectorAll(n) : this.children;
      for (const a of c)
        a.dispatchEvent(o);
    }
    return o;
  }
}, Pt = (r, t) => class extends r {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, n] of Object.entries(e))
      s in this || s in this.style && n !== void 0 && (n === null ? n = "none" : n === 0 && (n = "0"), this.style[s] !== n && (this.style[s] = n));
    return this;
  }
}, Rt = (r, t, ...e) => class extends r {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const s = (i) => super[i], n = (i, o) => {
      super[i] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(i, o) {
        return s(o);
      },
      set(i, o, c) {
        return n(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, kt = (r, t) => class extends r {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, Mt = (r, t) => class extends r {
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
let Wt = 0;
const Nt = (r, t) => class extends r {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e), this.setAttribute("uid", `uid${Wt++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, qt = (r, t) => class extends r {
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
        const n = e.style.getPropertyValue(s);
        if (!n) return !1;
        const i = e.style.getPropertyPriority(s);
        return i ? `${n} !${i}` : n === "none" ? null : n;
      },
      set(e, s, n) {
        if (s.startsWith("--") || (s = `--${s}`), n === null ? n = "none" : n === 0 && (n = "0"), n === void 0)
          return !0;
        const i = e.__[s];
        return n === i || (n === !1 ? e.style.removeProperty(s) : typeof n == "string" ? (n = n.trim(), n.endsWith("!important") ? e.style.setProperty(
          s,
          n.slice(0, -10),
          "important"
        ) : e.style.setProperty(s, n)) : e.style.setProperty(s, n)), !0;
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
    for (let [s, n] of Object.entries(e))
      s.endsWith("__") || s.startsWith("__") && (this.__[s.slice(2)] = n);
    return this;
  }
}, Ht = 9, It = -3, M = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": ft,
        "./mixins/attrs.js": lt,
        "./mixins/classes.js": pt,
        "./mixins/clear.js": _t,
        "./mixins/connect.js": gt,
        "./mixins/data.js": yt,
        "./mixins/detail.js": bt,
        "./mixins/find.js": wt,
        "./mixins/for_.js": jt,
        "./mixins/hook.js": vt,
        "./mixins/insert.js": Ot,
        "./mixins/novalidation.js": At,
        "./mixins/on.js": St,
        "./mixins/owner.js": zt,
        "./mixins/parent.js": Ct,
        "./mixins/props.js": Tt,
        "./mixins/send.js": Lt,
        "./mixins/style.js": Pt,
        "./mixins/super_.js": Rt,
        "./mixins/tab.js": kt,
        "./mixins/text.js": Mt,
        "./mixins/uid.js": Nt,
        "./mixins/vars.js": qt
      })
    ).map(([r, t]) => [r.slice(Ht, It), t])
  )
), D = (...r) => {
  const t = r.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = r.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), s = r.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const n = Object.entries(M).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
  return n.push(...s), n;
}, W = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(r, t, e) {
    t ? Object.defineProperty(r, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = r.__key__, e ? Object.defineProperty(r, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: e
    }) : e = r.__native__;
    const s = [t, r];
    return e && s.push({ extends: e }), customElements.define(...s), this.#t.registry.set(t, r), r;
  }
  get(r) {
    return this.#t.registry.get(r);
  }
  has(r) {
    return this.#t.registry.has(r);
  }
  values() {
    return this.#t.registry.values();
  }
}(), Zt = (r) => {
  const t = `x-${r}`;
  if (W.has(t))
    return W.get(t);
  const e = document.createElement(r), s = e.constructor;
  if (s === HTMLUnknownElement)
    throw new Error(`'${r}' is not native.`);
  const n = D("!text", H);
  return "textContent" in e && n.push(M.text), r === "form" && n.push(M.novalidation), r === "label" && n.push(M.for_), W.add(
    class tt extends Z(s, {}, ...n) {
      static __key__ = t;
      static __native__ = r;
      static create = (...o) => {
        const c = new tt();
        return I(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, Ut = (r) => {
  const t = Zt(r), e = new t();
  return I(e);
}, T = new Proxy(
  {},
  {
    get(r, t) {
      return t === "from" ? (e, { convert: s = !0 } = {}) => s ? Dt(e) : T[t]({ innerHTML: e }) : Ut(t);
    }
  }
);
function et(r, t) {
  if (r.nodeType === Node.TEXT_NODE)
    return document.createTextNode(r.textContent);
  if (r.nodeType !== Node.ELEMENT_NODE) return null;
  const e = t[r.tagName.toLowerCase()]();
  for (const { name: s, value: n } of Array.from(r.attributes))
    e.setAttribute(s, n);
  for (const s of Array.from(r.childNodes)) {
    const n = et(s, t);
    n && e.append(n);
  }
  return e;
}
function Dt(r) {
  const t = document.createElement("template");
  t.innerHTML = r;
  const e = [];
  for (const i of Array.from(t.content.childNodes)) {
    const o = et(i, T);
    o && (o instanceof HTMLElement && !o.className && o.removeAttribute("class"), e.push(o));
  }
  if (t.innerHTML = "", e.length === 1)
    return e[0];
  const s = document.createDocumentFragment();
  s.append(...e);
  const n = Array.from(s.children);
  return n.length === 1 ? n[0] : n;
}
const st = (r, t, e) => (W.add(r, t, e), k(r, "create", I(r)), r.create), V = "div", Kt = st(
  class extends Z(
    document.createElement(V).constructor,
    {},
    ...D(H)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = T.slot(), this.#t.dataSlot = T.slot({ name: "data", display: null }), this.#t.shadow = T.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  V
), b = Kt({ id: "app", parent: document.body }), Yt = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
});
for (const [r, t] of Object.entries(Yt)) {
  const e = window.matchMedia(`(width >= ${t}px)`), s = e.matches;
  b.$[r] = s, b.send(`_break_${r}`, { detail: s }), e.addEventListener("change", (n) => {
    const i = e.matches;
    b.$[r] = i, b.send(`_break_${r}`, { detail: i });
  });
}
const Ft = new ResizeObserver((r) => {
  setTimeout(() => {
    for (const t of r) {
      const e = t.contentRect.width, s = t.contentRect.height;
      b.$({ X: e, Y: s });
    }
  }, 0);
});
Ft.observe(b);
b.$.effects.add(
  (r) => {
    const { X: t, Y: e } = r;
    b.send("_resize"), t !== void 0 && b.send("_resize_x", { detail: t }), e !== void 0 && b.send("_resize_y", { detail: e });
  },
  ["X", "Y"]
);
const Vt = (r, t) => {
  if (p(r) !== "Object" || p(t) !== "Object" || ((() => {
    const e = ([s, n]) => n !== void 0;
    r = Object.fromEntries(Object.entries(r).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
  })(), Object.keys(r).length !== Object.keys(t).length)) return !1;
  for (const [e, s] of Object.entries(r))
    if (t[e] !== s) return !1;
  return !0;
}, Xt = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([s, n]) => {
          if (n = n.trim(), n === "") return [s, !0];
          if (n === "true") return [s, !0];
          const i = Number(n);
          return [s, Number.isNaN(i) ? n : i];
        }).filter(([s, n]) => !["false", "null", "undefined"].includes(n))
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
class K {
  static create = (...t) => new K(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = Xt.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && Vt(t.query, this.query);
  }
}
class Bt {
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
      const n = s.page;
      n instanceof HTMLElement && n.attribute && (n.attribute.page = t), typeof s.setup == "function" && await s.setup(t), e.setup = !0;
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
    this.#t.routes = new Bt(), this.#t.states = {
      path: at({ owner: this, name: "path" })
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
  async setup({ error: t, redirect: e, routes: s, strict: n = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = n, Object.assign(this.#t.config.redirect, e), s && this.routes.add({ ...s }), this.#t.initialized || (window.addEventListener("popstate", async (i) => {
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
    const n = K.create(t), i = this.#t.url ? n.match(this.#t.url) ? void 0 : (this.#t.url = n, () => {
      e || history.pushState({}, "", n.full);
    }) : (this.#t.url = n, () => {
      e || history.pushState({}, "", n.full);
    });
    if (!i)
      return this;
    this.#t.session++;
    const o = await (async () => {
      const { path: c, residual: a, route: u } = await this.#e(n.path) || {};
      if (!u) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#s(c, n.query, ...a), u === this.#t.route ? u.update && await u.update(
          { session: this.#t.session },
          n.query,
          ...a
        ) : (this.#t.route && this.#t.route.exit && await this.#t.route.exit({ session: this.#t.session }), u.enter && await u.enter(
          { session: this.#t.session },
          n.query,
          ...a
        ), this.#t.route = u);
      };
    })();
    if (!o) {
      if (i(), this.#s(n.path, n.query), s) {
        const c = `Invalid path: ${n.path}`;
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
      const n = `/${e.slice(0, s + 1).join("/")}`;
      if (this.routes.has(n)) {
        const i = e.slice(s + 1), o = await this.routes.get(n);
        return { path: n, route: o, residual: i };
      }
    }
  }
  /* Enables external hooks etc. */
  #s(t, e, ...s) {
    s.length && (t = `${t}/${s.join("/")}`), b.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #n() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), rt = new Proxy(async () => {
}, {
  get(r, t) {
    if (t === "router")
      return v;
    x.if(!(t in v), `Invalid key: ${t}`);
    const e = v[t];
    return typeof e == "function" ? e.bind(v) : e;
  },
  set(r, t, e) {
    return x.if(!(t in v), `Invalid key: ${t}`), v[t] = e, !0;
  },
  apply(r, t, e) {
    return v.use(...e);
  },
  deleteProperty(r, t) {
    v.routes.remove(t);
  },
  has(r, t) {
    return v.routes.has(t);
  }
}), X = "a", xe = st(
  class extends Z(
    document.createElement(X).constructor,
    {},
    ...D(H)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (r) => {
        if (this.path) {
          r.preventDefault();
          const t = this.#t.query ? this.path + Query.stringify(this.#t.query) : this.path;
          await rt(t);
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
  X
), Oe = (r) => (rt.effects.add(
  (t) => {
    const e = r.find(".active");
    e && e.classes.remove("active");
    const s = r.find(`[path="${t}"]`);
    s && s.classes.add("active");
  },
  (t) => !!t
), r), Qt = (r, t = !0) => t ? r.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : r.replace(/\s/g, ""), nt = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", nt);
const it = new nt(), R = "@media";
class Y {
  static create = (...t) => new Y(...t);
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
      (t) => Qt(t.cssText)
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
      const n = this.#s(this.owner, e);
      if (n) {
        if (n instanceof CSSStyleRule)
          this.#r(n, s);
        else if (n instanceof CSSMediaRule)
          for (const [i, o] of Object.entries(s)) {
            const c = this.#s(n, i);
            c ? this.#r(c, o) : this.#e(n, i, o);
          }
        else if (n instanceof CSSKeyframesRule)
          for (const [i, o] of Object.entries(s)) {
            const c = n.findRule(`${i}%`);
            c ? this.#r(c, o) : this.#e(n, selector, o);
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
    const n = t.cssRules[t.insertRule(`${e} { }`, t.cssRules.length)];
    if (n instanceof CSSStyleRule)
      return this.#r(n, s);
    if (n instanceof CSSMediaRule) {
      for (const [i, o] of Object.entries(s))
        this.#e(n, i, o);
      return n;
    }
    if (n instanceof CSSKeyframesRule) {
      for (const [i, o] of Object.entries(s))
        n.appendRule(`${i}% { }`), this.#r(n.findRule(`${i}%`), o);
      return n;
    }
  }
  #s(t, e) {
    "cssRules" in t || x.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    return e.startsWith(R) ? (e = e.slice(R.length).trim(), s.filter((n) => n instanceof CSSMediaRule).find((n) => n.conditionText === e) || null) : s.filter((n) => n instanceof CSSStyleRule).find((n) => n.selectorText === e) || null;
  }
  #n(t) {
    const e = Number(Object.keys(t)[0]);
    return typeof e == "number" && !Number.isNaN(e);
  }
  #i(t, e) {
    return !t.startsWith("@keyframes") && e && this.#n(e) ? `@keyframes ${t}` : t;
  }
  #o(t, ...e) {
    (!("cssRules" in t) || !("deleteRule" in t)) && x.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    for (let n of e) {
      let i;
      n.startsWith(R) ? (n = n.slice(R.length).trim(), i = s.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === n)) : i = s.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === n), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #r(t, e = {}) {
    t instanceof CSSRule || x.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [s, n] of Object.entries(e))
      if (n !== void 0) {
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = E(s.trim())), n === !1) {
          t.style.removeProperty(s);
          continue;
        }
        if (!this.#c(s))
          throw new Error(`Invalid key: ${s}`);
        if (typeof n == "string") {
          n = n.trim(), n.endsWith("!important") ? t.style.setProperty(
            s,
            n.slice(0, -10),
            "important"
          ) : t.style.setProperty(s, n);
          continue;
        }
        n === null && (n = "none"), t.style.setProperty(s, n);
      }
    return t;
  }
  #c(t) {
    return t in it.style || t.startsWith("--");
  }
}
class F {
  static create = (...t) => new F(...t);
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
class q extends CSSStyleSheet {
  static create = (...t) => new q(...t);
  #t = {
    detail: {}
  };
  constructor(...t) {
    super(), this.#t.rules = Y.create(this), this.#t.targets = F.create(this), this.#t.text = t.find((n, i) => !i && typeof n == "string"), this.#t.path = t.find((n, i) => i && typeof n == "string");
    const e = t.find((n) => p(n) === "Object"), s = t.find((n) => p(n) === "Object" && n !== e);
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
const Gt = document.documentElement, B = new class {
  #t = {};
  constructor() {
    this.#t.color = new class {
      get hex() {
        return new Proxy(
          {},
          {
            get(r, t) {
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
        get(r, t) {
          return `var(--${E(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(r, t) {
          return getComputedStyle(Gt).getPropertyValue(`--${E(t, { numbers: !0 })}`).trim();
        }
      }
    );
  }
  get color() {
    return this.#t.color;
  }
  attr(r) {
    return `attr(${r})`;
  }
  important(...r) {
    return `${r.join(" ")} !important`;
  }
  rotate(r) {
    return `rotate(${r})`;
  }
}(), Jt = new class {
  max(r) {
    return `@media (width <= ${r})`;
  }
  min(r) {
    return `@media (width >= ${r})`;
  }
}(), te = (r, t) => {
  if (!t.length) return q.create(r[0]);
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return q.create(e);
}, Ae = new Proxy(() => {
}, {
  get(r, t) {
    return t in B ? B[t] : t in it.style ? new Proxy(
      {},
      {
        get(e, s) {
          return { [t]: E(s, { numbers: !0 }) };
        }
      }
    ) : t === "media" ? Jt : (e) => `${e}${t === "pct" ? "%" : t}`;
  },
  apply(r, t, e) {
    const s = e.at(0);
    if (Array.isArray(s)) {
      const [n, ...i] = e;
      return te(n, i);
    }
    return s instanceof HTMLElement && "uid" in s ? `[uid="${s.uid}"]` : (e = e.map((n) => n === "!" ? "!important" : n), e.join(" "));
  }
}), Ee = (r, ...t) => (t.forEach(
  (e) => Object.defineProperties(
    r,
    Object.getOwnPropertyDescriptors(e.prototype)
  )
), r);
class ot {
  static create = (...t) => new ot(...t);
  #t = {
    detail: {},
    resolved: !1
  };
  constructor(...t) {
    const e = Promise.withResolvers();
    this.#t.promise = e.promise, this.#t.res = e.resolve;
    const { detail: s, name: n, owner: i } = t.find((o) => typeof o != "function") || {};
    Object.assign(this.detail, s), this.#t.name = n, this.#t.owner = i, this.#t.callback = t.find((o) => typeof o == "function") || null;
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
function ct(...r) {
  if (this.update)
    return this.update(...r);
  this.update = ct.bind(this), this.setAttribute("element", "");
  const t = r.find((c, a) => !a && typeof c == "string"), e = r.find((c, a) => a && typeof c == "string"), s = r.find((c) => p(c) === "Object") || {}, n = (() => {
    const { parent: c } = s;
    if (c)
      return delete s.parent, c;
  })(), i = r.filter((c) => c instanceof HTMLElement), o = r.filter((c) => typeof c == "function");
  t && (this.className = t);
  for (const [c, a] of Object.entries(s)) {
    if (c.startsWith("__") && !c.endsWith("__")) {
      const u = `--${c.slice(2)}`;
      a === null ? this.style.setProperty(u, "none") : this.style.setProperty(u, a);
      continue;
    }
    if (c in this) {
      this[c] = a;
      continue;
    }
    if (c in this.style) {
      a === null ? this.style[c] = "none" : this.style[c] = a;
      continue;
    }
    if (c.startsWith("_") && !c.endsWith("__")) {
      this[c] = a;
      continue;
    }
    if (c.startsWith("[")) {
      const u = c.slice(1, -1);
      Q.call(this, u, a);
      continue;
    }
    if (c.startsWith("data.")) {
      const u = `data-${c.slice(5)}`;
      Q.call(this, u, a);
      continue;
    }
    if (c.startsWith("on.")) {
      const [u, ...l] = c.slice(3).split("."), d = Object.fromEntries(l.map((f) => [f, !0]));
      this.addEventListener(u, a, d);
      continue;
    }
  }
  if (e && this.insertAdjacentText("afterbegin", e), n && n !== this.parentElement && n.append(this), this.append(...i), o.length) {
    const c = [];
    o.forEach((a) => {
      const u = a.call(this, this);
      typeof u == "function" && c.push(u);
    }), c.length && setTimeout(() => {
      c.forEach((a) => a.call(this, this));
    }, 0);
  }
  return this;
}
const $e = new Proxy(
  {},
  {
    get(r, t) {
      return (...e) => {
        const s = document.createElement(t);
        return ct.call(s, ...e), s;
      };
    }
  }
);
function Q(r, t) {
  t === !1 || t === null ? this.removeAttribute(r) : t === !0 ? this.setAttribute(r, "") : this.setAttribute(r, t);
}
function Se(r, ...t) {
  const e = this === globalThis ? null : this, s = {
    context: e,
    data: {},
    pipe: t,
    size: t.length
  };
  for (const [n, i] of t.entries())
    s.index = n, s.self = i, r = i.call(e, r, s);
  return r;
}
function ze(r) {
  return new Promise((t) => setTimeout(t, r));
}
function ee(r) {
  let t = r.parentElement;
  for (; t && t !== document.body; ) {
    const e = getComputedStyle(t), s = /(auto|scroll)/.test(e.overflowY), n = t.scrollHeight > t.clientHeight;
    if (s && n)
      return t;
    t = t.parentElement;
  }
  return window;
}
function Ce(r) {
  ee(r).scrollTo({ top: 0, behavior: "smooth" });
}
const Te = (r, t, { abs: e = 1e-4, rel: s = 1e-6 } = {}) => {
  if (r === t) return !0;
  const n = Math.abs(r - t);
  return n <= e || n <= Math.max(Math.abs(r), Math.abs(t)) * s;
}, Le = (r, { decimals: t = 2, banker: e = !1 } = {}) => {
  const s = 10 ** t, n = r * s, i = Math.round(n);
  return e && Math.abs(n % 1) === 0.5 ? Math.floor(n / 2) * 2 / s : i / s;
}, Pe = (r, t) => {
  const e = [{ target: r, source: t }];
  for (; e.length > 0; ) {
    const { target: s, source: n } = e.pop();
    for (const [i, o] of Object.entries(n)) {
      if (o === void 0) {
        delete s[i];
        continue;
      }
      p(o) === "Object" && p(s[i]) === "Object" ? e.push({
        target: s[i],
        source: o
      }) : s[i] = o;
    }
  }
  return r;
}, se = (r, t) => {
  if (!t.length) return r[0];
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return e;
}, Re = (r, ...t) => se(r, t), N = (r) => (Object.freeze(r), r instanceof Map ? r.forEach((t) => {
  p(t) === "Object" && N(t);
}) : r instanceof Set ? r.forEach((t) => {
  p(t) === "Object" && N(t);
}) : Object.values(r).forEach((t) => {
  p(t) === "Object" && N(t);
}), r), ke = N, Me = (r, t, e) => {
  const s = [{ target: r, source: t, merger: e }];
  for (; s.length > 0; ) {
    const {
      target: n,
      source: i,
      merger: o
    } = s.pop();
    for (const [c, a] of Object.entries(i)) {
      if (a === void 0) {
        delete n[c];
        continue;
      }
      p(a) === "Object" && p(n[c]) === "Object" ? s.push({
        target: n[c],
        source: a,
        merger: o
      }) : /* Handle arrays: use custom merger if provided, otherwise replace */ p(a) === "Array" && p(n[c]) === "Array" && o ? n[c] = o(n[c], a) : n[c] = a;
    }
  }
  return r;
}, G = (r) => {
  if (p(r) !== "Object") return r;
  const t = {};
  for (const [e, s] of Object.entries(r))
    s !== void 0 && (t[e] = s);
  return t;
}, We = (r, t) => {
  const e = [{ a: r, b: t }];
  for (; e.length > 0; ) {
    const { a: s, b: n } = e.pop(), i = p(s), o = p(n);
    if (i !== o) return !1;
    if (i !== "Object" && i !== "Array") {
      if (s !== n) return !1;
      continue;
    }
    if (i === "Array") {
      if (s.length !== n.length) return !1;
      for (let c = 0; c < s.length; c++)
        e.push({ a: s[c], b: n[c] });
      continue;
    }
    if (i === "Object") {
      const c = G(s), a = G(n), u = Object.keys(c), l = Object.keys(a);
      if (u.length !== l.length) return !1;
      for (const d of u) {
        if (!(d in a)) return !1;
        e.push({ a: c[d], b: a[d] });
      }
    }
  }
  return !0;
};
export {
  x as Exception,
  ot as Future,
  D as Mixins,
  Oe as Nav,
  xe as NavLink,
  A as Reactive,
  L as Ref,
  q as Sheet,
  b as app,
  Ee as assign,
  st as author,
  Yt as breakpoints,
  E as camelToKebab,
  fe as camelToPascal,
  T as component,
  Ae as css,
  Pe as deepAssign,
  ke as deepFreeze,
  ye as defineMethod,
  be as defineProperty,
  k as defineValue,
  ze as delay,
  $e as element,
  I as factory,
  N as freeze,
  Dt as fromHtml,
  Re as html,
  S as is,
  le as kebabToCamel,
  de as kebabToPascal,
  pe as kebabToSnake,
  We as match,
  Te as matchNumber,
  Vt as matchObject,
  Me as merge,
  Z as mix,
  M as mixins,
  _e as pascalToCamel,
  ge as pascalToKebab,
  Se as pipe,
  ue as reactive,
  at as ref,
  he as refMixin,
  W as registry,
  Le as roundNumber,
  rt as router,
  H as stateMixin,
  Ce as toTop,
  p as type,
  re as typeName,
  ct as updateElement
};

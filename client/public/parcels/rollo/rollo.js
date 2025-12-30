const _ = (r) => {
  if (typeof r == "object") {
    if (r?.__type__)
      return r.__type__;
    if (r?.constructor?.__type__)
      return r.constructor.__type__;
  }
  return Object.prototype.toString.call(r).slice(8, -1);
}, R = _, g = new class {
  array(r) {
    return _(r) === "Array";
  }
  arrow(r) {
    return typeof r == "function" && !r.hasOwnProperty("prototype") && r.toString().includes("=>");
  }
  async(r) {
    return _(r) === "AsyncFunction";
  }
  boolean(r) {
    return _(r) === "Boolean";
  }
  /* Shorthand */
  bool(r) {
    return this.boolean(r);
  }
  element(r) {
    return r instanceof HTMLElement;
  }
  function(r) {
    return ["AsyncFunction", "Function"].includes(_(r));
  }
  map(r) {
    return _(r) === "Map";
  }
  module(r) {
    return _(r) === "Module";
  }
  null(r) {
    return _(r) === "Null";
  }
  number(r) {
    return _(r) === "Number" && !Number.isNaN(r);
  }
  object(r) {
    return _(r) === "Object";
  }
  promise(r) {
    return _(r) === "Promise";
  }
  set(r) {
    return _(r) === "Set";
  }
  string(r) {
    return _(r) === "String";
  }
  /* Shorthand */
  str(r) {
    return this.string(r);
  }
  sync(r) {
    return _(r) === "Function";
  }
  undefined(r) {
    return _(r) === "Undefined";
  }
  /* Inspired by Python's `isinstance`, only with a slightly leaner syntax. */
  instance(r, ...t) {
    for (const e of t)
      if (e in this && this[e](r))
        return !0;
    return t.includes(_(r));
  }
  integer(r) {
    return this.number(r) && Number.isInteger(r);
  }
  /* Shorthand */
  int(r) {
    return this.integer(r);
  }
  /* Tests if value is a primitive or null or undefined.
  NOTE null and undefined are of course not primitives, 
  but are considered as such here. */
  primitive(r) {
    return [null, void 0].includes(r) || ["bigint", "boolean", "number", "string", "symbol"].includes(typeof r);
  }
}(), E = new class {
  if(t, e, s) {
    typeof t == "function" && (t = t()), t && this.raise(e, s);
  }
  raise(t, e) {
    throw e?.(), new Error(t);
  }
}();
class z {
  static __type__ = "Message";
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
  static __type__ = "Ref";
  static create = (...t) => new L(...t);
  #t = {
    detail: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(t = null, ...e) {
    this.#t.effects = new class {
      #e = {};
      constructor(l, f) {
        this.#e.owner = l, this.#e.registry = f;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(l, ...f) {
        const h = (() => {
          const m = f.find((p) => g.function(p));
          if (m)
            return m;
          const v = f.find((p) => Array.isArray(p));
          if (v)
            return (p) => v.includes(p);
        })(), {
          data: y = {},
          once: j,
          run: S = !0
        } = f.find((m, v) => !v && g.object(m)) || {}, O = (() => {
          const m = { data: { ...y } };
          return h && (m.condition = h), j && (m.once = j), m;
        })();
        if (this.#e.registry.set(l, O), S) {
          const m = z.create(this.#e.owner);
          m.detail = O, m.effect = l, (!h || h(this.#e.owner.current, m)) && l(this.#e.owner.current, m);
        }
        return l;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(l) {
        return this.#e.registry.has(l);
      }
      remove(l) {
        this.#e.registry.delete(l);
      }
    }(this, this.#t.registry);
    const s = e.find((d) => g.object(d)) || {}, {
      detail: n,
      hooks: i,
      match: o = function(d) {
        return this.current === d;
      },
      name: c,
      owner: u
    } = s, a = e.filter((d) => g.function(d));
    this.match = o, this.#t.name = c, this.#t.owner = u, n && (this.#t.detail = n), this.update(t);
    for (const d of a)
      this.effects.add(d);
    if (i)
      for (const d of i)
        d.call(this);
  }
  get __type__() {
    return this.constructor.__type__;
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
  - Option for updating value silently, i.e., non-reactively,
  and for setting detail. */
  update(t, { detail: e, silent: s = !1 } = {}, ...n) {
    if (e && (this.#t.detail = e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, s) return this;
    if (!this.effects.size) return this;
    const i = z.create(this);
    let o = 0;
    for (const [c, u] of this.#t.registry.entries()) {
      i.detail = u, i.effect = c, i.index = o++;
      const { condition: a, once: d } = u;
      if ((!a || a(this.current, i, ...n)) && (c(this.current, i, ...n), d && this.effects.remove(c, ...n), i.stopped))
        break;
    }
    return this;
  }
}
class A {
  static __type__ = "Reactive";
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
        return h === "effects" ? e.effects : h in e && g.function(e[h]) ? e[h].bind(e) : e.#t.current[h];
      },
      set(f, h, y) {
        return E.if(
          h === "effects" || h in e && g.function(e[h]),
          `Reserved key: ${h}.`
        ), e.update({ [h]: y }), !0;
      },
      apply(f, h, y) {
        return e.update(...y);
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
      add(h, ...y) {
        const {
          data: j,
          hooks: S,
          once: O = !1,
          run: m = !0
        } = y.find((b, T) => !T && g.object(b)) || {}, v = y.filter((b) => g.function(b)), p = L.create({ owner: e }), P = e.effects.add(
          (b, T) => {
            p.update(h(b, T));
          },
          { data: j, once: O, run: m }
        );
        this.#e.registry.set(p, P);
        for (const b of v)
          p.effects.add(b, { once: O, run: m });
        if (S)
          for (const b of S)
            b.call(p);
        return p;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (h, y) => h === y
      };
      get match() {
        return this.#e.match;
      }
      set match(h) {
        h !== void 0 && (this.#e.match = h);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(h, y) {
        this.#e.owner = h, this.#e.registry = y;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(h, ...y) {
        const j = (() => {
          const p = y.find((b) => g.function(b));
          if (p)
            return p;
          const P = y.find((b) => Array.isArray(b));
          if (P)
            return (b) => {
              for (const T of P)
                if (T in b)
                  return !0;
              return !1;
            };
        })(), {
          data: S = {},
          once: O,
          run: m = !0
        } = y.find((p) => g.object(p)) || {}, v = (() => {
          const p = { data: { ...S } };
          return j && (p.condition = j), O && (p.once = O), p;
        })();
        if (this.#e.registry.set(h, v), m) {
          const p = z.create(this.#e.owner);
          p.detail = v, p.effect = h, (!j || j(this.#e.owner.current, p)) && h(this.#e.owner.current, p);
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
      ...t.find((f, h) => !h && g.object(f)) || {}
    }, n = t.find((f, h) => h && g.object(f)) || {}, { config: i = {}, detail: o, hooks: c, name: u, owner: a } = n, { match: d } = i, l = t.filter((f) => g.function(f));
    this.#t.owner = a, this.#t.name = u, o && (this.#t.detail = o), this.config.match = d, this.update(s);
    for (const f of l)
      this.effects.add(f);
    if (c)
      for (const f of c)
        f.call(this);
  }
  get __type__() {
    return this.constructor.__type__;
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
      {
        config: { match: this.config.match },
        detail: structuredClone(this.detail)
      }
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
    else if (g.object(t))
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
  - Option for updating silently, i.e., non-reactively,
  and to set detail. */
  update(...t) {
    let e = t.find((u, a) => !a);
    const { detail: s, silent: n = !1 } = t.find((u, a) => a && g.object(u)) || {};
    if (s && (this.#t.detail = s), !e)
      return this;
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof A ? e = e.current : e = { ...e };
    const i = {};
    for (const [u, a] of Object.entries(e))
      if (!this.config.match(a, this.#t.current[u])) {
        if (a === void 0) {
          u in this.#t.current && (i[u] = a, this.#t.previous[u] = this.#t.current[u], delete this.#t.current[u]);
          continue;
        }
        i[u] = a, this.#t.previous[u] = this.#t.current[u], this.#t.current[u] = a;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, n) return this;
    if (!this.effects.size) return this;
    const o = z.create(this);
    let c = 0;
    for (const [u, a] of this.#t.registry.entries()) {
      o.detail = a, o.effect = u, o.index = c++;
      const { condition: d, once: l } = a;
      if ((!d || d(this.change, o)) && (u(this.change, o), l && this.effects.remove(u), o.stopped))
        break;
    }
    return this;
  }
}
const he = (...r) => A.create(...r).$, at = (...r) => {
  const t = L.create(...r);
  return new Proxy(() => {
  }, {
    get(e, s) {
      E.if(!(s in t), `Invalid key: ${s}`);
      const n = t[s];
      return g.function(n) ? n.bind(t) : n;
    },
    set(e, s, n) {
      return E.if(!(s in t), `Invalid key: ${s}`), t[s] = n, !0;
    },
    apply(e, s, n) {
      return t.update(...n), t.current;
    }
  });
}, et = "$", ht = et.length, I = (r) => class extends r {
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
        Object.entries(t).filter(([e, s]) => e.startsWith(et)).map(([e, s]) => [e.slice(ht), s])
      )
    ), this;
  }
}, fe = (r) => class extends r {
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
class ft {
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
const H = (r) => (...t) => {
  t = new ft(t);
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
}, lt = (r, t) => class extends r {
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
function $(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function le(r) {
  return r.length ? r[0].toUpperCase() + r.slice(1) : r;
}
function de(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase());
}
function pe(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase()).replace(/^([a-z])/, (t, e) => e.toUpperCase());
}
function _e(r) {
  return r.replaceAll("-", "_");
}
function ge(r) {
  return r.length ? r[0].toLowerCase() + r.slice(1) : r;
}
function me(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase();
}
const dt = (r, t) => class extends r {
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
class pt {
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
const _t = (r, t) => class extends r {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new pt(this), this.#t.class = new Proxy(() => {
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
}, gt = (r, t) => class extends r {
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
}, mt = (r, t) => class extends r {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, yt = 5, bt = (r, t) => class extends r {
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
        Object.entries(e).filter(([s, n]) => s.startsWith("data.")).map(([s, n]) => [`data-${s.slice(yt)}`, n])
      )
    ), this;
  }
}, wt = (r, t) => class extends r {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, jt = (r, t) => class extends r {
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
}, vt = (r, t) => class extends r {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
}, xt = (r, t) => class extends r {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class Et {
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
    super.__new__?.(...s), this.#t.insert = new Et(this);
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
const be = (r, t, e, {
  bind: s = !0,
  configurable: n = !0,
  enumerable: i = !0,
  writable: o = !0
} = {}) => (s && (e = e.bind(r)), Object.defineProperty(r, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), r), we = (r, t, { bind: e = !0, configurable: s = !0, enumerable: n = !1, get: i, set: o } = {}) => {
  e && (i = i.bind(r));
  const c = {
    configurable: s,
    enumerable: n,
    get: i
  };
  return o && (e && (o = o.bind(r)), c.set = o), Object.defineProperty(r, t, c), r;
}, M = (r, t, e, {
  bind: s = !0,
  configurable: n = !1,
  enumerable: i = !0,
  writable: o = !1
} = {}) => (s && e.bind && (e = e.bind(r)), Object.defineProperty(r, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), r), $t = 3;
class St {
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
const Ct = (r, t) => class extends r {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const s = this;
    this.#t.registry = new St(this);
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
          get(u, a) {
            return (...d) => {
              const l = d.find((h) => typeof h == "function"), f = d.find((h) => R(h) === "Object") || {};
              if (a === "use")
                return s.addEventListener(c, l, f);
              if (a === "unuse")
                return s.removeEventListener(c, l, f);
              throw new Error(`Invalid key: ${a}`);
            };
          },
          apply(u, a, d) {
            const l = d.find((h) => typeof h == "function"), f = d.find((h) => R(h) === "Object") || {};
            return s.addEventListener(c, l, f);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(i, o, c) {
        const [u, ...a] = o.split(".");
        return s.addEventListener(
          u,
          c,
          Object.fromEntries(a.map((d) => [d, !0]))
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
      track: u = !1,
      ...a
    } = s.find((l, f) => f && R(l) === "Object") || {};
    u && !o && this.#t.registry.add(n, i), super.addEventListener(n, i, { once: o, ...a });
    const d = {
      handler: i,
      once: o,
      remove: () => {
        this.removeEventListener(n, i, { track: u });
      },
      run: c,
      target: this,
      track: u,
      type: n,
      ...a
    };
    if (c) {
      const l = this.constructor.create();
      l.addEventListener(
        n,
        (f) => {
          M(f, "currentTarget", this), M(f, "target", this), M(f, "noevent", !0), i(f, d);
        },
        { once: !0 }
      ), n.startsWith("_") || n.includes("-") ? l.dispatchEvent(new CustomEvent(n)) : `on${n}` in l && n in l && typeof l[n] == "function" ? l[n]() : l.dispatchEvent(new Event(n));
    }
    return d;
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options makes chainable and enables object-based args.
  "Point-of-truth" event handler deregistration. */
  removeEventListener(...s) {
    const [n, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], { track: o = !1, ...c } = s.find((u, a) => a && R(u) === "Object") || {};
    return o && this.#t.registry.remove(n, i), super.removeEventListener(n, i, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(s = {}) {
    super.update?.(s);
    for (const [n, i] of Object.entries(s))
      if (n.startsWith("on.")) {
        const [o, ...c] = n.slice($t).split("."), u = Object.fromEntries(c.map((a) => [a, !0]));
        this.addEventListener(o, i, u);
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
}, Tt = (r, t) => class extends r {
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
}, Lt = (r, t) => class extends r {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, n] of Object.entries(e))
      s.startsWith("__") || !(s in this) && !s.startsWith("_") || n !== void 0 && this[s] !== n && (this[s] = n);
    return this;
  }
}, Pt = (r, t) => class extends r {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(e, { detail: s, trickle: n, ...i } = {}) {
    const o = s === void 0 ? new Event(e, i) : new CustomEvent(e, { detail: s, ...i });
    if (this.dispatchEvent(o), n) {
      const c = typeof n == "string" ? this.querySelectorAll(n) : this.children;
      for (const u of c)
        u.dispatchEvent(o);
    }
    return o;
  }
}, Rt = (r, t) => class extends r {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, n] of Object.entries(e))
      s in this || s in this.style && n !== void 0 && (n === null ? n = "none" : n === 0 && (n = "0"), this.style[s] !== n && (this.style[s] = n));
    return this;
  }
}, kt = (r, t, ...e) => class extends r {
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
}, Mt = (r, t) => class extends r {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, Nt = (r, t) => class extends r {
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
const qt = (r, t) => class extends r {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e), this.setAttribute("uid", `uid${Wt++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, It = (r, t) => class extends r {
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
}, Ht = 9, Zt = -3, N = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": lt,
        "./mixins/attrs.js": dt,
        "./mixins/classes.js": _t,
        "./mixins/clear.js": gt,
        "./mixins/connect.js": mt,
        "./mixins/data.js": bt,
        "./mixins/detail.js": wt,
        "./mixins/find.js": jt,
        "./mixins/for_.js": vt,
        "./mixins/hook.js": xt,
        "./mixins/insert.js": Ot,
        "./mixins/novalidation.js": At,
        "./mixins/on.js": Ct,
        "./mixins/owner.js": zt,
        "./mixins/parent.js": Tt,
        "./mixins/props.js": Lt,
        "./mixins/send.js": Pt,
        "./mixins/style.js": Rt,
        "./mixins/super_.js": kt,
        "./mixins/tab.js": Mt,
        "./mixins/text.js": Nt,
        "./mixins/uid.js": qt,
        "./mixins/vars.js": It
      })
    ).map(([r, t]) => [r.slice(Ht, Zt), t])
  )
), F = (...r) => {
  const t = r.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = r.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), s = r.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const n = Object.entries(N).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
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
}(), C = new Proxy(
  {},
  {
    get(r, t) {
      return t === "from" ? (e, { as: s = "div", convert: n = !0 } = {}) => n ? Dt(e, { as: s }) : C[s]({ innerHTML: e }) : Ft(t);
    }
  }
);
function Ut(r) {
  const t = `x-${r}`;
  if (W.has(t))
    return W.get(t);
  const e = document.createElement(r), s = e.constructor;
  if (s === HTMLUnknownElement)
    throw new Error(`'${r}' is not native.`);
  const n = F("!text", I);
  return "textContent" in e && n.push(N.text), r === "form" && n.push(N.novalidation), r === "label" && n.push(N.for_), W.add(
    class st extends Z(s, {}, ...n) {
      static __key__ = t;
      static __native__ = r;
      static create = (...o) => {
        const c = new st();
        return H(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}
function Ft(r) {
  const t = Ut(r), e = new t();
  return H(e);
}
function Dt(r, { as: t = "div" } = {}) {
  const e = document.createElement("div");
  e.innerHTML = r;
  const s = Array.from(e.children, (n) => Kt(n));
  return s.length > 1 ? C[t](...s) : s[0];
}
function V(r) {
  const t = C[r.tagName.toLowerCase()]();
  for (const { name: e, value: s } of Array.from(r.attributes))
    t.setAttribute(e, s);
  return t;
}
function Kt(r) {
  const t = V(r), e = Array.from(r.childNodes, (s) => [t, s]).reverse();
  for (; e.length; ) {
    const [s, n] = e.pop();
    if (n.nodeType === Node.TEXT_NODE) {
      s.append(document.createTextNode(n.textContent));
      continue;
    }
    if (n.nodeType !== Node.ELEMENT_NODE)
      continue;
    const i = V(n);
    s.append(i), e.push(...Array.from(n.childNodes, (o) => [i, o]).reverse());
  }
  return t;
}
const rt = (r, t, e) => (W.add(r, t, e), M(r, "create", H(r)), r.create), X = "div", Yt = rt(
  class extends Z(
    document.createElement(X).constructor,
    {},
    ...F(I)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = C.slot(), this.#t.dataSlot = C.slot({ name: "data", display: null }), this.#t.shadow = C.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  X
), w = Yt({ id: "app", parent: document.body }), Vt = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
});
for (const [r, t] of Object.entries(Vt)) {
  const e = window.matchMedia(`(width >= ${t}px)`), s = e.matches;
  w.$[r] = s, w.send(`_break_${r}`, { detail: s }), e.addEventListener("change", (n) => {
    const i = e.matches;
    w.$[r] = i, w.send(`_break_${r}`, { detail: i });
  });
}
const Xt = new ResizeObserver((r) => {
  setTimeout(() => {
    for (const t of r) {
      const e = t.contentRect.width, s = t.contentRect.height;
      w.$({ X: e, Y: s });
    }
  }, 0);
});
Xt.observe(w);
w.$.effects.add(
  (r) => {
    const { X: t, Y: e } = r;
    w.send("_resize"), t !== void 0 && w.send("_resize_x", { detail: t }), e !== void 0 && w.send("_resize_y", { detail: e });
  },
  ["X", "Y"]
);
const Qt = new class {
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
}(), Bt = (r, t) => {
  if (!g.object(r) || !g.object(t) || Object.keys(r).length !== Object.keys(t).length)
    return !1;
  for (const [e, s] of Object.entries(r))
    if (t[e] !== s)
      return !1;
  return !0;
};
class D {
  static create = (...t) => new D(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const s = e.search;
    this.#t.hash = e.hash, this.#t.query = Qt.parse(s), this.#t.full = s ? `${this.path}${s}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && Bt(t.query, this.query);
  }
}
class Gt {
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
const x = new class {
  #t = {
    config: { redirect: {} },
    session: 0
  };
  constructor() {
    this.#t.routes = new Gt(), this.#t.states = {
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
    const n = D.create(t), i = this.#t.url ? n.match(this.#t.url) ? void 0 : (this.#t.url = n, () => {
      e || history.pushState({}, "", n.full);
    }) : (this.#t.url = n, () => {
      e || history.pushState({}, "", n.full);
    });
    if (!i)
      return this;
    this.#t.session++;
    const o = await (async () => {
      const { path: c, residual: u, route: a } = await this.#e(n.path) || {};
      if (!a) {
        this.#t.route = null;
        return;
      }
      return async () => {
        this.#s(c, n.query, ...u), a === this.#t.route ? a.update && await a.update(
          { session: this.#t.session },
          n.query,
          ...u
        ) : (this.#t.route && this.#t.route.exit && await this.#t.route.exit({ session: this.#t.session }), a.enter && await a.enter(
          { session: this.#t.session },
          n.query,
          ...u
        ), this.#t.route = a);
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
    s.length && (t = `${t}/${s.join("/")}`), w.$({ path: t }), this.#t.states.path(t, {}, e, ...s);
  }
  #n() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), nt = new Proxy(async () => {
}, {
  get(r, t) {
    if (t === "router")
      return x;
    E.if(!(t in x), `Invalid key: ${t}`);
    const e = x[t];
    return typeof e == "function" ? e.bind(x) : e;
  },
  set(r, t, e) {
    return E.if(!(t in x), `Invalid key: ${t}`), x[t] = e, !0;
  },
  apply(r, t, e) {
    return x.use(...e);
  },
  deleteProperty(r, t) {
    x.routes.remove(t);
  },
  has(r, t) {
    return x.routes.has(t);
  }
}), Q = "a", Ee = rt(
  class extends Z(
    document.createElement(Q).constructor,
    {},
    ...F(I)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (r) => {
        if (this.path) {
          r.preventDefault();
          const t = this.#t.query ? this.path + Query.stringify(this.#t.query) : this.path;
          await nt(t);
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
  Q
), Oe = (r) => (nt.effects.add(
  (t) => {
    const e = r.find(".active");
    e && e.classes.remove("active");
    const s = r.find(`[path="${t}"]`);
    s && s.classes.add("active");
  },
  (t) => !!t
), r), Jt = (r, t = !0) => t ? r.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : r.replace(/\s/g, ""), it = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", it);
const ot = new it(), k = "@media";
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
      (t) => Jt(t.cssText)
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
    (!("cssRules" in t) || !("insertRule" in t)) && E.raise(
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
    "cssRules" in t || E.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    return e.startsWith(k) ? (e = e.slice(k.length).trim(), s.filter((n) => n instanceof CSSMediaRule).find((n) => n.conditionText === e) || null) : s.filter((n) => n instanceof CSSStyleRule).find((n) => n.selectorText === e) || null;
  }
  #n(t) {
    const e = Number(Object.keys(t)[0]);
    return typeof e == "number" && !Number.isNaN(e);
  }
  #i(t, e) {
    return !t.startsWith("@keyframes") && e && this.#n(e) ? `@keyframes ${t}` : t;
  }
  #o(t, ...e) {
    (!("cssRules" in t) || !("deleteRule" in t)) && E.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    for (let n of e) {
      let i;
      n.startsWith(k) ? (n = n.slice(k.length).trim(), i = s.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === n)) : i = s.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === n), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #r(t, e = {}) {
    t instanceof CSSRule || E.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [s, n] of Object.entries(e))
      if (n !== void 0) {
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = $(s.trim())), n === !1) {
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
    return t in ot.style || t.startsWith("--");
  }
}
class Y {
  static create = (...t) => new Y(...t);
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
    super(), this.#t.rules = K.create(this), this.#t.targets = Y.create(this), this.#t.text = t.find((n, i) => !i && typeof n == "string"), this.#t.path = t.find((n, i) => i && typeof n == "string");
    const e = t.find((n) => _(n) === "Object"), s = t.find((n) => _(n) === "Object" && n !== e);
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
const te = document.documentElement, B = new class {
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
          return `var(--${$(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(r, t) {
          return getComputedStyle(te).getPropertyValue(`--${$(t, { numbers: !0 })}`).trim();
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
}(), ee = new class {
  max(r) {
    return `@media (width <= ${r})`;
  }
  min(r) {
    return `@media (width >= ${r})`;
  }
}(), se = (r, t) => {
  if (!t.length) return q.create(r[0]);
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return q.create(e);
}, Ae = new Proxy(() => {
}, {
  get(r, t) {
    return t in B ? B[t] : t in ot.style ? new Proxy(
      {},
      {
        get(e, s) {
          return { [t]: $(s, { numbers: !0 }) };
        }
      }
    ) : t === "media" ? ee : (e) => `${e}${t === "pct" ? "%" : t}`;
  },
  apply(r, t, e) {
    const s = e.at(0);
    if (Array.isArray(s)) {
      const [n, ...i] = e;
      return se(n, i);
    }
    return s instanceof HTMLElement && "uid" in s ? `[uid="${s.uid}"]` : (e = e.map((n) => n === "!" ? "!important" : n), e.join(" "));
  }
});
class ct {
  static create = (...t) => new ct(...t);
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
function $e(r) {
  return new Promise((t) => setTimeout(t, r));
}
function ut(...r) {
  if (this.update)
    return this.update(...r);
  this.update = ut.bind(this), this.setAttribute("element", "");
  const t = r.find((c, u) => !u && typeof c == "string"), e = r.find((c, u) => u && typeof c == "string"), s = r.find((c) => _(c) === "Object") || {}, n = (() => {
    const { parent: c } = s;
    if (c)
      return delete s.parent, c;
  })(), i = r.filter((c) => c instanceof HTMLElement), o = r.filter((c) => typeof c == "function");
  t && (this.className = t);
  for (const [c, u] of Object.entries(s)) {
    if (c.startsWith("__") && !c.endsWith("__")) {
      const a = `--${c.slice(2)}`;
      u === null ? this.style.setProperty(a, "none") : this.style.setProperty(a, u);
      continue;
    }
    if (c in this) {
      this[c] = u;
      continue;
    }
    if (c in this.style) {
      u === null ? this.style[c] = "none" : this.style[c] = u;
      continue;
    }
    if (c.startsWith("_") && !c.endsWith("__")) {
      this[c] = u;
      continue;
    }
    if (c.startsWith("[")) {
      const a = c.slice(1, -1);
      G.call(this, a, u);
      continue;
    }
    if (c.startsWith("data.")) {
      const a = `data-${c.slice(5)}`;
      G.call(this, a, u);
      continue;
    }
    if (c.startsWith("on.")) {
      const [a, ...d] = c.slice(3).split("."), l = Object.fromEntries(d.map((f) => [f, !0]));
      this.addEventListener(a, u, l);
      continue;
    }
  }
  if (e && this.insertAdjacentText("afterbegin", e), n && n !== this.parentElement && n.append(this), this.append(...i), o.length) {
    const c = [];
    o.forEach((u) => {
      const a = u.call(this, this);
      typeof a == "function" && c.push(a);
    }), c.length && setTimeout(() => {
      c.forEach((u) => u.call(this, this));
    }, 0);
  }
  return this;
}
const Se = new Proxy(
  {},
  {
    get(r, t) {
      return (...e) => {
        const s = document.createElement(t);
        return ut.call(s, ...e), s;
      };
    }
  }
);
function G(r, t) {
  t === !1 || t === null ? this.removeAttribute(r) : t === !0 ? this.setAttribute(r, "") : this.setAttribute(r, t);
}
const J = (r, t) => {
  t && typeof t == "object" && r.push(t);
}, Ce = (r) => {
  const t = [r];
  for (; t.length; ) {
    const e = t.pop();
    if (Object.freeze(e), g.map(e) || g.set(e)) {
      for (const s of e.values())
        J(t, s);
      continue;
    }
    for (const s of Object.values(e))
      J(t, s);
  }
  return r;
}, re = (r, t) => {
  if (!t.length) return r[0];
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return e;
}, ze = (r, ...t) => re(r, t), tt = (r) => Object.fromEntries(
  Object.entries(r).filter(([t, e]) => e !== void 0)
), Te = (r, t, e = (s, n) => s === n) => {
  const s = [[r, t]];
  for (; s.length > 0; ) {
    const [n, i] = s.pop(), [o, c] = [_(n), _(i)];
    if (o !== c) return !1;
    if (!["Array", "Object"].includes(o)) {
      if (!e(n, i)) return !1;
      continue;
    }
    if (o === "Array") {
      if (n.length !== i.length) return !1;
      for (let u = 0; u < n.length; u++)
        s.push([n[u], i[u]]);
      continue;
    }
    if (o === "Object") {
      const [u, a] = [tt(n), tt(i)], d = Object.keys(u);
      if (d.length !== Object.keys(a).length) return !1;
      for (const l of d) {
        if (!(l in a)) return !1;
        s.push([u[l], a[l]]);
      }
    }
  }
  return !0;
}, Le = (r, t, e) => {
  const s = [[r, t]];
  for (; s.length; ) {
    const [n, i] = s.pop();
    for (const [o, c] of Object.entries(i)) {
      if (c === void 0) {
        delete n[o];
        continue;
      }
      const u = n[o], a = [_(u), _(c)];
      if (a.every(g.object)) {
        s.push([u, c]);
        continue;
      }
      n[o] = e && a.every(g.array) ? e(u, c) : c;
    }
  }
  return r;
}, Pe = (r, ...t) => (t.forEach(
  (e) => Object.defineProperties(
    r,
    Object.getOwnPropertyDescriptors(e.prototype)
  )
), r);
function Re(r, ...t) {
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
function ne(r) {
  let t = r.parentElement;
  for (; t && t !== document.body; ) {
    const e = getComputedStyle(t), s = /(auto|scroll)/.test(e.overflowY), n = t.scrollHeight > t.clientHeight;
    if (s && n)
      return t;
    t = t.parentElement;
  }
  return window;
}
function ke(r) {
  ne(r).scrollTo({ top: 0, behavior: "smooth" });
}
const Me = (r) => Array.from(new Set(r)), Ne = (r, t = (e) => e) => {
  const e = [];
  for (let s = 0; s < r; s++)
    e.push(t(s, e));
  return e;
}, We = (r, ...t) => {
  if (!r.length || !t.length) return r;
  for (let e = r.length - 1; e >= 0; e--)
    t.includes(r[e]) && r.splice(e, 1);
  return r;
}, qe = (r) => typeof r != "string" ? !1 : r === null || r === "" ? !0 : /^-?\d*[.,]?\d*$/.test(r), Ie = (r, t, { abs: e = 1e-4, rel: s = 1e-6 } = {}) => {
  if (r === t) return !0;
  const n = Math.abs(r - t);
  return n <= e || n <= Math.max(Math.abs(r), Math.abs(t)) * s;
}, He = (r, { decimals: t = 2, banker: e = !1 } = {}) => {
  const s = 10 ** t, n = r * s, i = Math.round(n);
  return e && Math.abs(n % 1) === 0.5 ? Math.floor(n / 2) * 2 / s : i / s;
}, Ze = (r) => (Object.keys(r).forEach((t) => delete r[t]), r), Ue = (r, t) => ((() => {
  const e = ([s, n]) => n !== void 0;
  r = Object.fromEntries(Object.entries(r).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(r).filter(([e, s]) => t[e] !== s)
)), Fe = (r, t) => ((() => {
  const e = ([s, n]) => n !== void 0;
  r = Object.fromEntries(Object.entries(r).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(r).filter(
    ([e, s]) => e in t && t[e] === s
  )
));
export {
  E as Exception,
  ct as Future,
  F as Mixins,
  Oe as Nav,
  Ee as NavLink,
  A as Reactive,
  L as Ref,
  q as Sheet,
  w as app,
  rt as author,
  Vt as breakpoints,
  $ as camelToKebab,
  le as camelToPascal,
  Ze as clearObject,
  C as component,
  Ae as css,
  Me as deduplicate,
  be as defineMethod,
  we as defineProperty,
  M as defineValue,
  $e as delay,
  Se as element,
  H as factory,
  Ce as freeze,
  ze as html,
  g as is,
  qe as isNumeric,
  de as kebabToCamel,
  pe as kebabToPascal,
  _e as kebabToSnake,
  Te as match,
  Ie as matchNumber,
  Le as merge,
  Z as mix,
  N as mixins,
  Pe as mixup,
  Ue as objectDifference,
  Fe as objectIntersection,
  ge as pascalToCamel,
  me as pascalToKebab,
  Re as pipe,
  Ne as range,
  he as reactive,
  at as ref,
  fe as refMixin,
  W as registry,
  We as removeFromArray,
  He as roundNumber,
  nt as router,
  I as stateMixin,
  ke as toTop,
  _ as type,
  R as typeName,
  ut as updateElement
};

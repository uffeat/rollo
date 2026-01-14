const g = (s) => {
  if (typeof s == "object") {
    if (s?.__type__)
      return s.__type__;
    if (s?.constructor?.__type__)
      return s.constructor.__type__;
  }
  return Object.prototype.toString.call(s).slice(8, -1);
}, P = g, d = new class {
  array(s) {
    return g(s) === "Array";
  }
  arrow(s) {
    return typeof s == "function" && !s.hasOwnProperty("prototype") && s.toString().includes("=>");
  }
  async(s) {
    return g(s) === "AsyncFunction";
  }
  boolean(s) {
    return g(s) === "Boolean";
  }
  /* Shorthand */
  bool(s) {
    return this.boolean(s);
  }
  element(s) {
    return s instanceof HTMLElement;
  }
  function(s) {
    return ["AsyncFunction", "Function"].includes(g(s));
  }
  map(s) {
    return g(s) === "Map";
  }
  module(s) {
    return g(s) === "Module";
  }
  null(s) {
    return g(s) === "Null";
  }
  /* Checks if string value contains only digits - allowing for 
  - a single decimal mark ('.' or ',') and 
  - a leading '-'
  - null and ''. 
  */
  numeric(s) {
    return typeof s != "string" ? !1 : s === null || s === "" ? !0 : /^-?\d*[.,]?\d*$/.test(s);
  }
  number(s) {
    return g(s) === "Number" && !Number.isNaN(s);
  }
  object(s) {
    return g(s) === "Object";
  }
  promise(s) {
    return g(s) === "Promise";
  }
  set(s) {
    return g(s) === "Set";
  }
  string(s) {
    return g(s) === "String";
  }
  /* Shorthand */
  str(s) {
    return this.string(s);
  }
  sync(s) {
    return g(s) === "Function";
  }
  undefined(s) {
    return g(s) === "Undefined";
  }
  /* Inspired by Python's `isinstance`, only with a slightly leaner syntax. */
  instance(s, ...t) {
    for (const e of t)
      if (e in this && this[e](s))
        return !0;
    return t.includes(g(s));
  }
  integer(s) {
    return this.number(s) && Number.isInteger(s);
  }
  /* Shorthand */
  int(s) {
    return this.integer(s);
  }
  /* Tests if value is a primitive or null or undefined.
  NOTE null and undefined are of course not primitives, 
  but are considered as such here. */
  primitive(s) {
    return [null, void 0].includes(s) || ["bigint", "boolean", "number", "string", "symbol"].includes(typeof s);
  }
}(), E = new class {
  if(t, e, r) {
    typeof t == "function" && (t = t()), t && this.raise(e, r);
  }
  raise(t, e) {
    throw e?.(), new Error(t);
  }
}();
class L {
  static __type__ = "Message";
  static create = (...t) => new L(...t);
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
class T {
  static __type__ = "Ref";
  static create = (...t) => new T(...t);
  #t = {
    detail: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(t = null, ...e) {
    this.#t.effects = new class {
      #e = {};
      constructor(l, h) {
        this.#e.owner = l, this.#e.registry = h;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(l, ...h) {
        const f = (() => {
          const m = h.find((_) => d.function(_));
          if (m)
            return m;
          const v = h.find((_) => Array.isArray(_));
          if (v)
            return (_) => v.includes(_);
        })(), {
          data: y = {},
          once: j,
          run: C = !0
        } = h.find((m, v) => !v && d.object(m)) || {}, O = (() => {
          const m = { data: { ...y } };
          return f && (m.condition = f), j && (m.once = j), m;
        })();
        if (this.#e.registry.set(l, O), C) {
          const m = L.create(this.#e.owner);
          m.detail = O, m.effect = l, (!f || f(this.#e.owner.current, m)) && l(this.#e.owner.current, m);
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
    const r = e.find((p) => d.object(p)) || {}, {
      detail: n,
      hooks: i,
      match: o = function(p) {
        return this.current === p;
      },
      name: c,
      owner: u
    } = r, a = e.filter((p) => d.function(p));
    this.match = o, this.#t.name = c, this.#t.owner = u, n && (this.#t.detail = n), this.update(t);
    for (const p of a)
      this.effects.add(p);
    if (i)
      for (const p of i)
        p.call(this);
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
  update(t, { detail: e, silent: r = !1 } = {}, ...n) {
    if (e && (this.#t.detail = e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const i = L.create(this);
    let o = 0;
    for (const [c, u] of this.#t.registry.entries()) {
      i.detail = u, i.effect = c, i.index = o++;
      const { condition: a, once: p } = u;
      if ((!a || a(this.current, i, ...n)) && (c(this.current, i, ...n), p && this.effects.remove(c, ...n), i.stopped))
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
      get(h, f) {
        return f === "effects" ? e.effects : f in e && d.function(e[f]) ? e[f].bind(e) : e.#t.current[f];
      },
      set(h, f, y) {
        return E.if(
          f === "effects" || f in e && d.function(e[f]),
          `Reserved key: ${f}.`
        ), e.update({ [f]: y }), !0;
      },
      apply(h, f, y) {
        return e.update(...y);
      },
      deleteProperty(h, f) {
        e.update({ [f]: void 0 });
      },
      has(h, f) {
        return f in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(f, ...y) {
        const {
          data: j,
          hooks: C,
          once: O = !1,
          run: m = !0
        } = y.find((b, z) => !z && d.object(b)) || {}, v = y.filter((b) => d.function(b)), _ = T.create({ owner: e }), R = e.effects.add(
          (b, z) => {
            _.update(f(b, z));
          },
          { data: j, once: O, run: m }
        );
        this.#e.registry.set(_, R);
        for (const b of v)
          _.effects.add(b, { once: O, run: m });
        if (C)
          for (const b of C)
            b.call(_);
        return _;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (f, y) => f === y
      };
      get match() {
        return this.#e.match;
      }
      set match(f) {
        f !== void 0 && (this.#e.match = f);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(f, y) {
        this.#e.owner = f, this.#e.registry = y;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(f, ...y) {
        const j = (() => {
          const _ = y.find((b) => d.function(b));
          if (_)
            return _;
          const R = y.find((b) => Array.isArray(b));
          if (R)
            return (b) => {
              for (const z of R)
                if (z in b)
                  return !0;
              return !1;
            };
        })(), {
          data: C = {},
          once: O,
          run: m = !0
        } = y.find((_) => d.object(_)) || {}, v = (() => {
          const _ = { data: { ...C } };
          return j && (_.condition = j), O && (_.once = O), _;
        })();
        if (this.#e.registry.set(f, v), m) {
          const _ = L.create(this.#e.owner);
          _.detail = v, _.effect = f, (!j || j(this.#e.owner.current, _)) && f(this.#e.owner.current, _);
        }
        return f;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(f) {
        return this.#e.registry.has(f);
      }
      remove(f) {
        this.#e.registry.delete(f);
      }
    }(this, this.#t.registry);
    const r = {
      ...t.find((h, f) => !f && d.object(h)) || {}
    }, n = t.find((h, f) => f && d.object(h)) || {}, { config: i = {}, detail: o, hooks: c, name: u, owner: a } = n, { match: p } = i, l = t.filter((h) => d.function(h));
    this.#t.owner = a, this.#t.name = u, o && (this.#t.detail = o), this.config.match = p, this.update(r);
    for (const h of l)
      this.effects.add(h);
    if (c)
      for (const h of c)
        h.call(this);
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
    const e = this.keys().map((r) => [r, void 0]);
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
    const r = {};
    for (const [n, i] of this.entries())
      t([n, i]) || (r[n] = void 0);
    return this.update(r, { silent: e });
  }
  forEach(t) {
    return this.entries().forEach(t), this;
  }
  has(t) {
    return t in this.#t.current;
  }
  map(t, e = !1) {
    const r = this.entries().map(t);
    return this.update(r, { silent: e });
  }
  /* Tests if other contains the same non-undefined items as current.
  NOTE Does not participate in reactivity, but useful extra, especially for testing. */
  match(t) {
    if (t instanceof A)
      t = t.current;
    else if (d.object(t))
      t = Object.fromEntries(
        Object.entries(t).filter(([e, r]) => r !== void 0)
      );
    else
      return !1;
    if (this.size !== Object.keys(t).length) return !1;
    for (const [e, r] of this.entries())
      if (!this.config.match(t[e], r)) return !1;
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
    const { detail: r, silent: n = !1 } = t.find((u, a) => a && d.object(u)) || {};
    if (r && (this.#t.detail = r), !e)
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
    const o = L.create(this);
    let c = 0;
    for (const [u, a] of this.#t.registry.entries()) {
      o.detail = a, o.effect = u, o.index = c++;
      const { condition: p, once: l } = a;
      if ((!p || p(this.change, o)) && (u(this.change, o), l && this.effects.remove(u), o.stopped))
        break;
    }
    return this;
  }
}
const de = (...s) => A.create(...s).$, ht = (...s) => {
  const t = T.create(...s);
  return new Proxy(() => {
  }, {
    get(e, r) {
      E.if(!(r in t), `Invalid key: ${r}`);
      const n = t[r];
      return d.function(n) ? n.bind(t) : n;
    },
    set(e, r, n) {
      return E.if(!(r in t), `Invalid key: ${r}`), t[r] = n, !0;
    },
    apply(e, r, n) {
      return t.update(...n), t.current;
    }
  });
}, st = "$", lt = st.length, I = (s) => class extends s {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = A.create({ owner: this }), this.#t.state.effects.add(
      (t, e) => {
        this.update(t);
        const r = Object.fromEntries(
          Object.entries(t).filter(([n, i]) => !(n in this && !n.startsWith("_")) && !(n in this.style) && !n.startsWith("[") && !n.startsWith("data.") && !n.startsWith(".") && !n.startsWith("__") && !n.startsWith("on.")).map(([n, i]) => [`state-${n}`, i])
        );
        this.attributes.update(r);
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
        Object.entries(t).filter(([e, r]) => e.startsWith(st)).map(([e, r]) => [e.slice(lt), r])
      )
    ), this;
  }
}, pe = (s) => class extends s {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = T.create({ owner: this }), this.#t.ref.effects.add(
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
class dt {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((t, e) => g(t) === "Object") || {}), this.#t.updates;
  }
}
const Z = (s) => (...t) => {
  t = new dt(t);
  const e = typeof s == "function" ? new s(t) : s;
  if (e.constructor.__new__?.call(e, t), e.__new__?.(t), e.classes && e.classes.add(t.classes), e.update?.(t.updates), t.text && e.insertAdjacentText("afterbegin", t.text), e.append?.(...t.children), e.__init__?.(t), e.constructor.__init__?.call(e, t), t.hooks) {
    const r = [];
    t.hooks.forEach((n) => {
      const i = n.call(e, e);
      typeof i == "function" && r.push(i);
    }), r.length && setTimeout(() => {
      r.forEach((n) => n.call(e, e));
    }, 0);
  }
  return e;
}, D = (s, t, ...e) => {
  let r = s;
  for (const n of e)
    r = n(r, t, ...e);
  return r;
}, pt = (s, t) => class extends s {
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
function $(s, { numbers: t = !1 } = {}) {
  return t ? String(s).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function _e(s) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
function ge(s) {
  return String(s).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase());
}
function me(s) {
  return String(s).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase()).replace(/^([a-z])/, (t, e) => e.toUpperCase());
}
function ye(s) {
  return s.replaceAll("-", "_");
}
function be(s) {
  return s.length ? s[0].toLowerCase() + s.slice(1) : s;
}
function we(s, { numbers: t = !1 } = {}) {
  return t ? String(s).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase() : String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase();
}
const _t = (s, t) => class extends s {
  static __name__ = "attrs";
  #t = {};
  constructor() {
    super();
    const e = this, r = super.attributes;
    this.#t.attributes = new class {
      /* Returns attributes NamedNodeMap (for advanced use). */
      get attributes() {
        return r;
      }
      get owner() {
        return e;
      }
      /* Returns number of set attributes. */
      get size() {
        return r.length;
      }
      /* Returns attribute entries. */
      entries() {
        return Array.from(r, (i) => [
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
        return Array.from(r, (i) => i.name);
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
        return Array.from(r, (i) => i.value);
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
  attributeChangedCallback(e, r, n) {
    super.attributeChangedCallback?.(e, r, n), this.dispatchEvent(
      new CustomEvent("_attribute", {
        detail: Object.freeze({ name: e, previous: r, current: n })
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
        Object.entries(e).filter(([r, n]) => r.startsWith("[") && r.endsWith("]")).map(([r, n]) => [r.slice(1, -1), n])
      )
    ), this;
  }
};
class gt {
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
    for (const r of e)
      if (!this.owner.classList.contains(r))
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
    for (let r = 0; r < t.length; r++) {
      const n = e.at(r);
      if (n)
        this.owner.classList.replace(t[r], n);
      else
        break;
    }
    return this.owner;
  }
  /* Toggles classes. */
  toggle(t, e) {
    const r = this.#e(t);
    for (const n of r)
      this.owner.classList.toggle(n, e);
    return this.owner;
  }
  #e(t) {
    if (t) {
      const e = t.includes(".") ? "." : " ";
      return t.split(e).map((r) => r.trim()).filter((r) => !!r);
    }
    return [];
  }
}
const mt = (s, t) => class extends s {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new gt(this), this.#t.class = new Proxy(() => {
    }, {
      get(r, n) {
        e.classes.add(n);
      },
      set(r, n, i) {
        return e.classes[i ? "add" : "remove"](n), !0;
      },
      apply(r, n, i) {
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
    for (const [r, n] of Object.entries(e))
      r.startsWith(".") && (n === void 0 || n === "..." || this.classes[n ? "add" : "remove"](r));
    return this;
  }
}, yt = (s, t) => class extends s {
  static __name__ = "clear";
  /* Clears content, optionally subject to selector. Chainable. */
  clear(e) {
    if (e)
      for (const r of Array.from(this.children))
        r.matches(e) && r.remove();
    else {
      for (; this.firstElementChild; )
        this.firstElementChild.remove();
      this.innerHTML = "";
    }
    return this;
  }
}, bt = (s, t) => class extends s {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, wt = 5, jt = (s, t) => class extends s {
  static __name__ = "data";
  #t = {};
  constructor() {
    super(), this.#t.data = new Proxy(this, {
      get(e, r) {
        return e.attributes.get(`data-${r}`);
      },
      set(e, r, n) {
        return e.attributes.set(`data-${r}`, n), !0;
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
        Object.entries(e).filter(([r, n]) => r.startsWith("data.")).map(([r, n]) => [`data-${r.slice(wt)}`, n])
      )
    ), this;
  }
}, vt = (s, t) => class extends s {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, xt = (s, t) => class extends s {
  static __name__ = "find";
  /* Unified alternative to 'querySelector' and 'querySelectorAll' 
  with a leaner syntax. */
  find(e) {
    const r = this.querySelectorAll(e);
    return r.length === 1 ? r[0] : r.length ? r.values() : null;
  }
  search(e) {
    const r = this.querySelectorAll(e) || null;
    if (r)
      return r.values();
  }
}, Et = (s, t) => class extends s {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
}, Ot = (s, t) => class extends s {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class At {
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
const $t = (s, t, ...e) => class extends s {
  static __name__ = "insert";
  #t = {};
  __new__(...r) {
    super.__new__?.(...r), this.#t.insert = new At(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, St = (s, t) => class extends s {
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
class F {
  static create = (...t) => new F(...t);
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
      const r = /* @__PURE__ */ new Set();
      r.add(e), this.#t.registry.set(t, r);
    }
  }
  clear(t) {
    if (t === void 0) {
      this.#t.registry.clear();
      return;
    }
    this.#t.registry.has(t) && (this.#t.registry.get(t).clear(), this.#t.registry.delete(t));
  }
  has(t, e) {
    return this.#t.registry.has(t) ? this.#t.registry.get(t).has(e) : !1;
  }
  remove(t, e) {
    if (this.#t.registry.has(t)) {
      const r = this.#t.registry.get(t);
      r.delete(e), r.size || this.#t.registry.delete(t);
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
const ve = (s, t, e, {
  bind: r = !0,
  configurable: n = !0,
  enumerable: i = !0,
  writable: o = !0
} = {}) => (r && (e = e.bind(s)), Object.defineProperty(s, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), s), xe = (s, t, { bind: e = !0, configurable: r = !0, enumerable: n = !1, get: i, set: o } = {}) => {
  e && (i = i.bind(s));
  const c = {
    configurable: r,
    enumerable: n,
    get: i
  };
  return o && (e && (o = o.bind(s)), c.set = o), Object.defineProperty(s, t, c), s;
}, W = (s, t, e, {
  bind: r = !0,
  configurable: n = !1,
  enumerable: i = !0,
  writable: o = !1
} = {}) => (r && e.bind && (e = e.bind(s)), Object.defineProperty(s, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), s), Ct = 3;
class Lt {
  #t = {};
  constructor(t) {
    this.#t.registry = F.create(), this.#t.owner = t;
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
      for (const r of e)
        this.#t.owner.removeEventListener(t, r);
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
const zt = (s, t) => class extends s {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const r = this;
    this.#t.registry = new Lt(this);
    const n = new class {
      get types() {
        return r.#t.registry.types;
      }
      clear(i) {
        return r.#t.registry.clear(i);
      }
      has(i, o) {
        return r.#t.registry.has(i, o);
      }
      size(i) {
        return r.#t.registry.size(i);
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
            return (...p) => {
              const l = p.find((f) => typeof f == "function"), h = p.find((f) => P(f) === "Object") || {};
              if (a === "use")
                return r.addEventListener(c, l, h);
              if (a === "unuse")
                return r.removeEventListener(c, l, h);
              throw new Error(`Invalid key: ${a}`);
            };
          },
          apply(u, a, p) {
            const l = p.find((f) => typeof f == "function"), h = p.find((f) => P(f) === "Object") || {};
            return r.addEventListener(c, l, h);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(i, o, c) {
        const [u, ...a] = o.split(".");
        return r.addEventListener(
          u,
          c,
          Object.fromEntries(a.map((p) => [p, !0]))
        ), !0;
      },
      /* Enable syntax like:
      button.on({ click: (event) => console.log("Clicked") });
      button.on({ once: true }, { click: (event) => console.log("Clicked") });
      button.on("click", (event) => console.log("Clicked"));
      button.on("click", (event) => console.log("Clicked"), { once: true });
      */
      apply(i, o, c) {
        return r.addEventListener(...c);
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
  addEventListener(...r) {
    const [n, i] = typeof r[0] == "string" ? r : Object.entries(r[0])[0], {
      once: o = !1,
      run: c = !1,
      track: u = !1,
      ...a
    } = r.find((l, h) => h && P(l) === "Object") || {};
    u && !o && this.#t.registry.add(n, i), super.addEventListener(n, i, { once: o, ...a });
    const p = {
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
        (h) => {
          W(h, "currentTarget", this), W(h, "target", this), W(h, "noevent", !0), i(h, p);
        },
        { once: !0 }
      ), n.startsWith("_") || n.includes("-") ? l.dispatchEvent(new CustomEvent(n)) : `on${n}` in l && n in l && typeof l[n] == "function" ? l[n]() : l.dispatchEvent(new Event(n));
    }
    return p;
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options makes chainable and enables object-based args.
  "Point-of-truth" event handler deregistration. */
  removeEventListener(...r) {
    const [n, i] = typeof r[0] == "string" ? r : Object.entries(r[0])[0], { track: o = !1, ...c } = r.find((u, a) => a && P(u) === "Object") || {};
    return o && this.#t.registry.remove(n, i), super.removeEventListener(n, i, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(r = {}) {
    super.update?.(r);
    for (const [n, i] of Object.entries(r))
      if (n.startsWith("on.")) {
        const [o, ...c] = n.slice(Ct).split("."), u = Object.fromEntries(c.map((a) => [a, !0]));
        this.addEventListener(o, i, u);
      }
    return this;
  }
}, Tt = (s, t) => class extends s {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(e) {
    this.#t.owner = e, this.attribute && (this.attribute = e && "uid" in e ? e.uid : e);
  }
}, Rt = (s, t) => class extends s {
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
}, Pt = (s, t) => class extends s {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [r, n] of Object.entries(e))
      r.startsWith("__") || !(r in this) && !r.startsWith("_") || n !== void 0 && this[r] !== n && (this[r] = n);
    return this;
  }
}, kt = (s, t) => class extends s {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(e, { detail: r, trickle: n, ...i } = {}) {
    const o = r === void 0 ? new Event(e, i) : new CustomEvent(e, { detail: r, ...i });
    if (this.dispatchEvent(o), n) {
      const c = typeof n == "string" ? this.querySelectorAll(n) : this.children;
      for (const u of c)
        u.dispatchEvent(o);
    }
    return o;
  }
}, Mt = (s, t) => class extends s {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [r, n] of Object.entries(e))
      r in this || r in this.style && n !== void 0 && (n === null ? n = "none" : n === 0 && (n = "0"), this.style[r] !== n && (this.style[r] = n));
    return this;
  }
}, Wt = (s, t, ...e) => class extends s {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const r = (i) => super[i], n = (i, o) => {
      super[i] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(i, o) {
        return r(o);
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
}, Nt = (s, t) => class extends s {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, qt = (s, t) => class extends s {
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
let Ut = 0;
const Ht = (s, t) => class extends s {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e), this.setAttribute("uid", `uid${Ut++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, It = (s, t) => class extends s {
  static __name__ = "vars";
  #t = {};
  constructor() {
    super(), this.#t.__ = new Proxy(this, {
      get(e, r) {
        if (r.startsWith("--") || (r = `--${r}`), e.isConnected) {
          const o = getComputedStyle(e).getPropertyValue(r).trim();
          if (!o) return !1;
          const c = e.style.getPropertyPriority(r);
          return c ? `${o} !${c}` : o === "none" ? null : o;
        }
        const n = e.style.getPropertyValue(r);
        if (!n) return !1;
        const i = e.style.getPropertyPriority(r);
        return i ? `${n} !${i}` : n === "none" ? null : n;
      },
      set(e, r, n) {
        if (r.startsWith("--") || (r = `--${r}`), n === null ? n = "none" : n === 0 && (n = "0"), n === void 0)
          return !0;
        const i = e.__[r];
        return n === i || (n === !1 ? e.style.removeProperty(r) : typeof n == "string" ? (n = n.trim(), n.endsWith("!important") ? e.style.setProperty(
          r,
          n.slice(0, -10),
          "important"
        ) : e.style.setProperty(r, n)) : e.style.setProperty(r, n)), !0;
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
    for (let [r, n] of Object.entries(e))
      r.endsWith("__") || r.startsWith("__") && (this.__[r.slice(2)] = n);
    return this;
  }
}, Zt = 9, Dt = -3, N = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": pt,
        "./mixins/attrs.js": _t,
        "./mixins/classes.js": mt,
        "./mixins/clear.js": yt,
        "./mixins/connect.js": bt,
        "./mixins/data.js": jt,
        "./mixins/detail.js": vt,
        "./mixins/find.js": xt,
        "./mixins/for_.js": Et,
        "./mixins/hook.js": Ot,
        "./mixins/insert.js": $t,
        "./mixins/novalidation.js": St,
        "./mixins/on.js": zt,
        "./mixins/owner.js": Tt,
        "./mixins/parent.js": Rt,
        "./mixins/props.js": Pt,
        "./mixins/send.js": kt,
        "./mixins/style.js": Mt,
        "./mixins/super_.js": Wt,
        "./mixins/tab.js": Nt,
        "./mixins/text.js": qt,
        "./mixins/uid.js": Ht,
        "./mixins/vars.js": It
      })
    ).map(([s, t]) => [s.slice(Zt, Dt), t])
  )
), K = (...s) => {
  const t = s.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = s.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), r = s.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const n = Object.entries(N).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
  return n.push(...r), n;
}, q = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(s, t, e) {
    t ? Object.defineProperty(s, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = s.__key__, e ? Object.defineProperty(s, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: e
    }) : e = s.__native__;
    const r = [t, s];
    return e && r.push({ extends: e }), customElements.define(...r), this.#t.registry.set(t, s), s;
  }
  get(s) {
    return this.#t.registry.get(s);
  }
  has(s) {
    return this.#t.registry.has(s);
  }
  values() {
    return this.#t.registry.values();
  }
}(), Ft = (s) => {
  const t = `x-${s}`;
  if (q.has(t))
    return q.get(t);
  const e = document.createElement(s), r = e.constructor;
  if (r === HTMLUnknownElement)
    throw new Error(`'${s}' is not native.`);
  const n = K("!text", I);
  return "textContent" in e && n.push(N.text), s === "form" && n.push(N.novalidation), s === "label" && n.push(N.for_), q.add(
    class nt extends D(r, {}, ...n) {
      static __key__ = t;
      static __native__ = s;
      static create = (...o) => {
        const c = new nt();
        return Z(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, Kt = (s) => {
  const t = Ft(s), e = new t();
  return Z(e);
}, S = new Proxy(
  {},
  {
    get(s, t, e) {
      return t === "from" ? (r, { as: n, convert: i = !0, ...o } = {}) => {
        if (i) {
          const c = Yt(r);
          return c.length === 1 ? n ? S[n](o, c[0]) : c[0].update(o) : S[n || "div"](o, ...c);
        }
        return S[n || "div"]({ innerHTML: r, ...o });
      } : Kt(t);
    }
  }
);
function Yt(s) {
  const t = document.createElement("div");
  return t.innerHTML = s, Array.from(t.children, (r) => Bt(r));
}
function X(s) {
  const t = S[s.tagName.toLowerCase()]();
  for (const { name: e, value: r } of Array.from(s.attributes))
    t.setAttribute(e, r);
  return t;
}
function Bt(s) {
  const t = X(s), e = Array.from(s.childNodes, (r) => [t, r]).reverse();
  for (; e.length; ) {
    const [r, n] = e.pop();
    if (n.nodeType === Node.TEXT_NODE) {
      r.append(document.createTextNode(n.textContent));
      continue;
    }
    if (n.nodeType !== Node.ELEMENT_NODE)
      continue;
    const i = X(n);
    r.append(i), e.push(...Array.from(n.childNodes, (o) => [i, o]).reverse());
  }
  return t;
}
const it = (s, t, e) => (q.add(s, t, e), W(s, "create", Z(s)), s.create), Q = "div", Vt = it(
  class extends D(
    document.createElement(Q).constructor,
    {},
    ...K(I)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = S.slot(), this.#t.dataSlot = S.slot({ name: "data", display: null }), this.#t.shadow = S.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  Q
), w = Vt({ id: "app", parent: document.body }), Xt = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
});
for (const [s, t] of Object.entries(Xt)) {
  const e = window.matchMedia(`(width >= ${t}px)`), r = e.matches;
  w.$[s] = r, w.send(`_break_${s}`, { detail: r }), e.addEventListener("change", (n) => {
    const i = e.matches;
    w.$[s] = i, w.send(`_break_${s}`, { detail: i });
  });
}
const Qt = new ResizeObserver((s) => {
  setTimeout(() => {
    for (const t of s) {
      const e = t.contentRect.width, r = t.contentRect.height;
      w.$({ X: e, Y: r });
    }
  }, 0);
});
Qt.observe(w);
w.$.effects.add(
  (s) => {
    const { X: t, Y: e } = s;
    w.send("_resize"), t !== void 0 && w.send("_resize_x", { detail: t }), e !== void 0 && w.send("_resize_y", { detail: e });
  },
  ["X", "Y"]
);
const Gt = new class {
  parse(t) {
    const e = t.split("?").at(-1);
    return Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(e), ([r, n]) => {
          if (n = n.trim(), n === "") return [r, !0];
          if (n === "true") return [r, !0];
          const i = Number(n);
          return [r, Number.isNaN(i) ? n : i];
        }).filter(([r, n]) => !["false", "null", "undefined"].includes(n))
      )
    );
  }
  stringify(t) {
    return t = Object.fromEntries(
      Object.entries(t).filter(
        ([e, r]) => ![!1, null, void 0].includes(r)
      )
    ), "?" + new URLSearchParams(t).toString().replaceAll("=true", "");
  }
}(), Jt = (s, t) => {
  if (!d.object(s) || !d.object(t) || Object.keys(s).length !== Object.keys(t).length)
    return !1;
  for (const [e, r] of Object.entries(s))
    if (t[e] !== r)
      return !1;
  return !0;
};
class Y {
  static create = (...t) => new Y(...t);
  #t = {};
  constructor(t) {
    const e = new URL(t, location.origin);
    this.#t.path = e.pathname;
    const r = e.search;
    this.#t.hash = e.hash, this.#t.query = Gt.parse(r), this.#t.full = r ? `${this.path}${r}${this.hash}` : `${this.path}${this.hash}`;
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
    return t.path === this.path && t.hash === this.hash && Jt(t.query, this.query);
  }
}
class te {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  get size() {
    return this.#t.registry.size;
  }
  add(...t) {
    const e = t.at(0), r = t.at(1);
    return t.at(2), this.#t.registry.set(e, { route: r }), this;
  }
  async get(t) {
    const e = this.#t.registry.get(t), r = e.route;
    if (!e.setup) {
      const n = r.page;
      n instanceof HTMLElement && n.attribute && (n.attribute.page = t), typeof r.setup == "function" && await r.setup(t), e.setup = !0;
    }
    return r;
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
    this.#t.routes = new te(), this.#t.states = {
      path: ht({ owner: this, name: "path" })
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
  async setup({ error: t, redirect: e, routes: r, strict: n = !0 } = {}) {
    return this.#t.config.error = t, this.#t.config.strict = n, Object.assign(this.#t.config.redirect, e), r && this.routes.add({ ...r }), this.#t.initialized || (window.addEventListener("popstate", async (i) => {
      await this.use(this.#n(), {
        context: "pop"
      });
    }), await this.use(this.#n(), {
      context: "setup"
    }), this.#t.initialized = !0), this;
  }
  /* Invokes route. */
  async use(t, { context: e, strict: r } = {}) {
    t in this.#t.config.redirect && (t = this.#t.config.redirect[t]), r = r === void 0 ? this.#t.config.strict : r;
    const n = Y.create(t), i = this.#t.url ? n.match(this.#t.url) ? void 0 : (this.#t.url = n, () => {
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
        this.#r(c, n.query, ...u), a === this.#t.route ? a.update && await a.update(
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
      if (i(), this.#r(n.path, n.query), r) {
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
    for (let r = e.length - 1; r >= 0; r--) {
      const n = `/${e.slice(0, r + 1).join("/")}`;
      if (this.routes.has(n)) {
        const i = e.slice(r + 1), o = await this.routes.get(n);
        return { path: n, route: o, residual: i };
      }
    }
  }
  /* Enables external hooks etc. */
  #r(t, e, ...r) {
    r.length && (t = `${t}/${r.join("/")}`), w.$({ path: t }), this.#t.states.path(t, {}, e, ...r);
  }
  #n() {
    return location.search ? `${location.pathname}${location.search}${location.hash}` : `${location.pathname}${location.hash}`;
  }
}(), ot = new Proxy(async () => {
}, {
  get(s, t) {
    if (t === "router")
      return x;
    E.if(!(t in x), `Invalid key: ${t}`);
    const e = x[t];
    return typeof e == "function" ? e.bind(x) : e;
  },
  set(s, t, e) {
    return E.if(!(t in x), `Invalid key: ${t}`), x[t] = e, !0;
  },
  apply(s, t, e) {
    return x.use(...e);
  },
  deleteProperty(s, t) {
    x.routes.remove(t);
  },
  has(s, t) {
    return x.routes.has(t);
  }
}), G = "a", $e = it(
  class extends D(
    document.createElement(G).constructor,
    {},
    ...K(I)
  ) {
    #t = {};
    constructor() {
      super(), this.attribute.webComponent = !0, this.attribute[this.constructor.__key__] = !0, this.on.click = async (s) => {
        if (this.path) {
          s.preventDefault();
          const t = this.#t.query ? this.path + Query.stringify(this.#t.query) : this.path;
          await ot(t);
        }
      };
    }
    get path() {
      return this.attribute.path;
    }
    set path(s) {
      this.attribute.path = s;
    }
    get query() {
      if (this.#t.query)
        return Object.freeze({ ...this.#t.query });
    }
    set query(s) {
      this.#t.query = s;
    }
    get selected() {
      return this.attribute.selected || !1;
    }
    set selected(s) {
      this.attribute.selected = s;
    }
  },
  "nav-link",
  G
), Se = (s) => (ot.effects.add(
  (t) => {
    const e = s.find(".active");
    e && e.classes.remove("active");
    const r = s.find(`[path="${t}"]`);
    r && r.classes.add("active");
  },
  (t) => !!t
), s), ee = (s, t = !0) => t ? s.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : s.replace(/\s/g, ""), ct = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", ct);
const ut = new ct(), k = "@media";
class B {
  static create = (...t) => new B(...t);
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
      (t) => ee(t.cssText)
    ).join(" ");
  }
  /* Adds rules. */
  add(t) {
    for (const [e, r] of Object.entries(t))
      this.#e(this.owner, this.#i(e, r), r);
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
    return this.#r(this.owner, this.#i(t));
  }
  /* Removes rules. */
  remove(...t) {
    return this.#o(this.owner, ...t);
  }
  /* Updates or creates rules. */
  update(t) {
    for (let [e, r] of Object.entries(t)) {
      e = this.#i(e, r);
      const n = this.#r(this.owner, e);
      if (n) {
        if (n instanceof CSSStyleRule)
          this.#s(n, r);
        else if (n instanceof CSSMediaRule)
          for (const [i, o] of Object.entries(r)) {
            const c = this.#r(n, i);
            c ? this.#s(c, o) : this.#e(n, i, o);
          }
        else if (n instanceof CSSKeyframesRule)
          for (const [i, o] of Object.entries(r)) {
            const c = n.findRule(`${i}%`);
            c ? this.#s(c, o) : this.#e(n, selector, o);
          }
      } else
        this.#e(this.owner, e, r);
    }
    return this;
  }
  #e(t, e, r) {
    (!("cssRules" in t) || !("insertRule" in t)) && E.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const n = t.cssRules[t.insertRule(`${e} { }`, t.cssRules.length)];
    if (n instanceof CSSStyleRule)
      return this.#s(n, r);
    if (n instanceof CSSMediaRule) {
      for (const [i, o] of Object.entries(r))
        this.#e(n, i, o);
      return n;
    }
    if (n instanceof CSSKeyframesRule) {
      for (const [i, o] of Object.entries(r))
        n.appendRule(`${i}% { }`), this.#s(n.findRule(`${i}%`), o);
      return n;
    }
  }
  #r(t, e) {
    "cssRules" in t || E.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const r = Array.from(t.cssRules);
    return e.startsWith(k) ? (e = e.slice(k.length).trim(), r.filter((n) => n instanceof CSSMediaRule).find((n) => n.conditionText === e) || null) : r.filter((n) => n instanceof CSSStyleRule).find((n) => n.selectorText === e) || null;
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
    const r = Array.from(t.cssRules);
    for (let n of e) {
      let i;
      n.startsWith(k) ? (n = n.slice(k.length).trim(), i = r.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === n)) : i = r.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === n), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #s(t, e = {}) {
    t instanceof CSSRule || E.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [r, n] of Object.entries(e))
      if (n !== void 0) {
        if (r.startsWith("__") ? r = `--${r.slice(2)}` : r.startsWith("--") || (r = $(r.trim())), n === !1) {
          t.style.removeProperty(r);
          continue;
        }
        if (!this.#c(r))
          throw new Error(`Invalid key: ${r}`);
        if (typeof n == "string") {
          n = n.trim(), n.endsWith("!important") ? t.style.setProperty(
            r,
            n.slice(0, -10),
            "important"
          ) : t.style.setProperty(r, n);
          continue;
        }
        n === null && (n = "none"), t.style.setProperty(r, n);
      }
    return t;
  }
  #c(t) {
    return t in ut.style || t.startsWith("--");
  }
}
class V {
  static create = (...t) => new V(...t);
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
      for (let r = e.length - 1; r >= 0; r--)
        e[r] === this.owner && e.splice(r, 1);
    }
  }
}
class U extends CSSStyleSheet {
  static create = (...t) => new U(...t);
  #t = {
    detail: {}
  };
  constructor(...t) {
    super(), this.#t.rules = B.create(this), this.#t.targets = V.create(this), this.#t.text = t.find((n, i) => !i && typeof n == "string"), this.#t.path = t.find((n, i) => i && typeof n == "string");
    const e = t.find((n) => g(n) === "Object"), r = t.find((n) => g(n) === "Object" && n !== e);
    this.text && this.replaceSync(this.text), e && this.rules.add(e), Object.assign(this.detail, r);
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
      const r = e.shadowRoot || e;
      this.targets.remove(r);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...t) {
    t.length || t.push(document);
    for (const e of t) {
      const r = e.shadowRoot || e;
      this.targets.add(r);
    }
    return this;
  }
}
const re = document.documentElement, J = new class {
  #t = {};
  constructor() {
    this.#t.color = new class {
      get hex() {
        return new Proxy(
          {},
          {
            get(s, t) {
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
        get(s, t) {
          return `var(--${$(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(s, t) {
          return getComputedStyle(re).getPropertyValue(`--${$(t, { numbers: !0 })}`).trim();
        }
      }
    );
  }
  get color() {
    return this.#t.color;
  }
  attr(s) {
    return `attr(${s})`;
  }
  important(...s) {
    return `${s.join(" ")} !important`;
  }
  rotate(s) {
    return `rotate(${s})`;
  }
}(), se = new class {
  max(s) {
    return `@media (width <= ${s})`;
  }
  min(s) {
    return `@media (width >= ${s})`;
  }
}(), ne = (s, t) => {
  if (!t.length) return U.create(s[0]);
  let e = s[0];
  for (let r = 0; r < t.length; r++)
    e += String(t[r]) + s[r + 1];
  return U.create(e);
}, Ce = new Proxy(() => {
}, {
  get(s, t) {
    return t in J ? J[t] : t in ut.style ? new Proxy(
      {},
      {
        get(e, r) {
          return { [t]: $(r, { numbers: !0 }) };
        }
      }
    ) : t === "media" ? se : (e) => `${e}${t === "pct" ? "%" : t}`;
  },
  apply(s, t, e) {
    const r = e.at(0);
    if (Array.isArray(r)) {
      const [n, ...i] = e;
      return ne(n, i);
    }
    return r instanceof HTMLElement && "uid" in r ? `[uid="${r.uid}"]` : (e = e.map((n) => n === "!" ? "!important" : n), e.join(" "));
  }
});
class at {
  static create = (...t) => new at(...t);
  #t = {
    detail: {},
    resolved: !1
  };
  constructor(...t) {
    const e = Promise.withResolvers();
    this.#t.promise = e.promise, this.#t.res = e.resolve;
    const { detail: r, name: n, owner: i } = t.find((o) => typeof o != "function") || {};
    Object.assign(this.detail, r), this.#t.name = n, this.#t.owner = i, this.#t.callback = t.find((o) => typeof o == "function") || null;
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
class H {
  static create = (...t) => new H(...t);
  static encodings = Object.freeze(["base64", "binary", "dataURL", "text"]);
  #t = {};
  constructor(t) {
    this.#t.file = t;
  }
  get file() {
    return this.#t.file;
  }
  get name() {
    return this.#t.file.name;
  }
  get type() {
    return this.#t.file.type || "application/octet-stream";
  }
  async base64() {
    const t = await this.dataURL();
    return t.substring(t.indexOf(";base64,") + 8);
  }
  async binary() {
    return await this.file.arrayBuffer();
  }
  async dataURL() {
    return new Promise((t, e) => {
      const r = new FileReader();
      r.onload = () => {
        t(r.result);
      }, r.onerror = () => e(r.error), r.readAsDataURL(this.file);
    });
  }
  /* Use for sending the file representation with `postMessage`. */
  async dto({ auto: t = !0, encoding: e = "binary" } = {}) {
    if (!H.encodings.includes(e))
      throw new Error(`Unsupported encoding: ${e}`);
    t && e !== "text" && await this.isText() && (e = "text");
    let r;
    return e === "base64" ? r = await this.base64() : e === "binary" ? r = await this.binary() : e === "dataURL" ? r = await this.dataURL() : e === "text" && (r = await this.text()), {
      content: r,
      content_type: this.type,
      encoding: e,
      name: this.name
    };
  }
  /* Use for sending the file representation directly to the server`. */
  async json({ auto: t = !0, encoding: e = "base64" } = {}) {
    return JSON.stringify(await this.dto({ auto: t, encoding: e }));
  }
  async text() {
    return this.file.text();
  }
  async isText() {
    try {
      const e = await this.file.slice(0, 5120).arrayBuffer(), r = new Uint8Array(e);
      return !new TextDecoder("utf-8", { fatal: !0 }).decode(r).includes("\0");
    } catch {
      return !1;
    }
  }
}
const Le = (s) => {
  if (d.object(s))
    return Object.keys(s).forEach((t) => delete s[t]), s;
  if (d.map(s) || d.set(s))
    return s.clear(), s;
  if (d.array(s))
    return s.length = 0, s;
};
function ze(s) {
  return new Promise((t) => setTimeout(t, s));
}
function ft(...s) {
  if (this.update)
    return this.update(...s);
  this.update = ft.bind(this), this.setAttribute("element", "");
  const t = s.find((c, u) => !u && typeof c == "string"), e = s.find((c, u) => u && typeof c == "string"), r = s.find((c) => g(c) === "Object") || {}, n = (() => {
    const { parent: c } = r;
    if (c)
      return delete r.parent, c;
  })(), i = s.filter((c) => c instanceof HTMLElement), o = s.filter((c) => typeof c == "function");
  t && (this.className = t);
  for (const [c, u] of Object.entries(r)) {
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
      tt.call(this, a, u);
      continue;
    }
    if (c.startsWith("data.")) {
      const a = `data-${c.slice(5)}`;
      tt.call(this, a, u);
      continue;
    }
    if (c.startsWith("on.")) {
      const [a, ...p] = c.slice(3).split("."), l = Object.fromEntries(p.map((h) => [h, !0]));
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
const Te = new Proxy(
  {},
  {
    get(s, t) {
      return (...e) => {
        const r = document.createElement(t);
        return ft.call(r, ...e), r;
      };
    }
  }
);
function tt(s, t) {
  t === !1 || t === null ? this.removeAttribute(s) : t === !0 ? this.setAttribute(s, "") : this.setAttribute(s, t);
}
const et = (s, t) => {
  t && typeof t == "object" && s.push(t);
}, Re = (s) => {
  const t = [s];
  for (; t.length; ) {
    const e = t.pop();
    if (Object.freeze(e), d.map(e) || d.set(e)) {
      for (const r of e.values())
        et(t, r);
      continue;
    }
    for (const r of Object.values(e))
      et(t, r);
  }
  return s;
}, ie = (s, t) => {
  if (!t.length) return s[0];
  let e = s[0];
  for (let r = 0; r < t.length; r++)
    e += String(t[r]) + s[r + 1];
  return e;
}, Pe = (s, ...t) => ie(s, t), rt = (s) => Object.fromEntries(
  Object.entries(s).filter(([t, e]) => e !== void 0)
), ke = (s, t, e = (r, n) => r === n) => {
  const r = [[s, t]];
  for (; r.length > 0; ) {
    const [n, i] = r.pop(), [o, c] = [g(n), g(i)];
    if (o !== c) return !1;
    if (!["Array", "Object"].includes(o)) {
      if (!e(n, i)) return !1;
      continue;
    }
    if (o === "Array") {
      if (n.length !== i.length) return !1;
      for (let u = 0; u < n.length; u++)
        r.push([n[u], i[u]]);
      continue;
    }
    if (o === "Object") {
      const [u, a] = [rt(n), rt(i)], p = Object.keys(u);
      if (p.length !== Object.keys(a).length) return !1;
      for (const l of p) {
        if (!(l in a)) return !1;
        r.push([u[l], a[l]]);
      }
    }
  }
  return !0;
}, Me = (s, t, e) => {
  const r = [[s, t]];
  for (; r.length; ) {
    const [n, i] = r.pop();
    for (const [o, c] of Object.entries(i)) {
      if (c === void 0) {
        delete n[o];
        continue;
      }
      const u = n[o], a = [g(u), g(c)];
      if (a.every(d.object)) {
        r.push([u, c]);
        continue;
      }
      n[o] = e && a.every(d.array) ? e(u, c) : c;
    }
  }
  return s;
}, We = (s, ...t) => (t.forEach(
  (e) => Object.defineProperties(
    s,
    Object.getOwnPropertyDescriptors(e.prototype)
  )
), s);
function Ne(s, ...t) {
  const e = this === globalThis ? null : this, r = {
    context: e,
    data: {},
    pipe: t,
    size: t.length
  };
  for (const [n, i] of t.entries())
    r.index = n, r.self = i, s = i.call(e, s, r);
  return s;
}
const oe = (s, ...t) => {
  if (d.object(s)) {
    for (const e of t)
      delete s[e];
    return s;
  }
  if (d.map(s)) {
    for (const e of t)
      s.delete(e);
    return s;
  }
  if (d.set(s)) {
    for (const e of t)
      s.delete(e);
    return s;
  }
  if (d.array(s)) {
    if (!s.length || !t.length) return s;
    for (let e = t.length - 1; e >= 0; e--)
      t.includes(s[e]) && s.splice(e, 1);
    return s;
  }
}, M = (s) => s.length === 1 ? s[0] : s, qe = (s, ...t) => {
  if (d.object(s)) {
    const e = t.map((r) => {
      const n = s[r];
      return delete s[r], n;
    });
    return M(e);
  }
  if (d.map(s)) {
    const e = t.map((r) => {
      const n = s.get(r);
      return s.delete(r), n;
    });
    return M(e);
  }
  if (d.set(s)) {
    for (const e of t)
      s.delete(e);
    return M(t);
  }
  if (d.array(s))
    return oe(s, ...t), M(t);
};
function ce(s) {
  let t = s.parentElement;
  for (; t && t !== document.body; ) {
    const e = getComputedStyle(t), r = /(auto|scroll)/.test(e.overflowY), n = t.scrollHeight > t.clientHeight;
    if (r && n)
      return t;
    t = t.parentElement;
  }
  return window;
}
function Ue(s) {
  ce(s).scrollTo({ top: 0, behavior: "smooth" });
}
const He = (s) => Array.from(new Set(s)), Ie = (s, t = (e) => e) => {
  const e = [];
  for (let r = 0; r < s; r++)
    e.push(t(r, e));
  return e;
}, Ze = (s, t, { abs: e = 1e-4, rel: r = 1e-6 } = {}) => {
  if (s === t) return !0;
  const n = Math.abs(s - t);
  return n <= e || n <= Math.max(Math.abs(s), Math.abs(t)) * r;
}, De = (s, { decimals: t = 2, banker: e = !1 } = {}) => {
  const r = 10 ** t, n = s * r, i = Math.round(n);
  return e && Math.abs(n % 1) === 0.5 ? Math.floor(n / 2) * 2 / r : i / r;
}, Fe = (s, t) => ((() => {
  const e = ([r, n]) => n !== void 0;
  s = Object.fromEntries(Object.entries(s).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(s).filter(([e, r]) => t[e] !== r)
)), Ke = (s, t) => ((() => {
  const e = ([r, n]) => n !== void 0;
  s = Object.fromEntries(Object.entries(s).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(s).filter(
    ([e, r]) => e in t && t[e] === r
  )
));
export {
  Kt as Component,
  E as Exception,
  at as Future,
  H as InputFile,
  K as Mixins,
  Se as Nav,
  $e as NavLink,
  A as Reactive,
  T as Ref,
  U as Sheet,
  F as TaggedSets,
  w as app,
  it as author,
  Xt as breakpoints,
  $ as camelToKebab,
  _e as camelToPascal,
  Le as clear,
  S as component,
  Ce as css,
  He as deduplicate,
  ve as defineMethod,
  xe as defineProperty,
  W as defineValue,
  ze as delay,
  Te as element,
  Ze as equal,
  Z as factory,
  Re as freeze,
  Pe as html,
  d as is,
  ge as kebabToCamel,
  me as kebabToPascal,
  ye as kebabToSnake,
  ke as match,
  Me as merge,
  D as mix,
  N as mixins,
  We as mixup,
  Fe as objectDifference,
  Ke as objectIntersection,
  be as pascalToCamel,
  we as pascalToKebab,
  Ne as pipe,
  qe as pop,
  Ie as range,
  de as reactive,
  ht as ref,
  pe as refMixin,
  q as registry,
  oe as remove,
  De as round,
  ot as router,
  I as stateMixin,
  Ue as toTop,
  g as type,
  P as typeName,
  ft as updateElement
};

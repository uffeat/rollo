const m = (r) => {
  if (typeof r == "object") {
    if (r?.__type__)
      return r.__type__;
    if (r?.constructor?.__type__)
      return r.constructor.__type__;
  }
  return Object.prototype.toString.call(r).slice(8, -1);
}, R = m, p = new class {
  array(r) {
    return m(r) === "Array";
  }
  arrow(r) {
    return typeof r == "function" && !r.hasOwnProperty("prototype") && r.toString().includes("=>");
  }
  async(r) {
    return m(r) === "AsyncFunction";
  }
  boolean(r) {
    return m(r) === "Boolean";
  }
  /* Shorthand */
  bool(r) {
    return this.boolean(r);
  }
  element(r) {
    return r instanceof HTMLElement;
  }
  function(r) {
    return typeof r == "function";
  }
  map(r) {
    return m(r) === "Map";
  }
  module(r) {
    return m(r) === "Module";
  }
  null(r) {
    return m(r) === "Null";
  }
  /* Checks if string value contains only digits - allowing for 
  - a single decimal mark ('.' or ',') and 
  - a leading '-'
  - null and ''. 
  */
  numeric(r) {
    return typeof r != "string" ? !1 : r === null || r === "" ? !0 : /^-?\d*[.,]?\d*$/.test(r);
  }
  number(r) {
    return m(r) === "Number" && !Number.isNaN(r);
  }
  object(r) {
    return m(r) === "Object";
  }
  promise(r) {
    return m(r) === "Promise";
  }
  set(r) {
    return m(r) === "Set";
  }
  string(r) {
    return m(r) === "String";
  }
  /* Shorthand */
  str(r) {
    return this.string(r);
  }
  sync(r) {
    return m(r) === "Function";
  }
  undefined(r) {
    return m(r) === "Undefined";
  }
  /* Inspired by Python's `isinstance`, only with a slightly leaner syntax. */
  instance(r, ...t) {
    for (const e of t)
      if (e in this && this[e](r))
        return !0;
    return t.includes(m(r));
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
class C {
  static __type__ = "Message";
  static create = (...t) => new C(...t);
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
  static __type__ = "Ref";
  static create = (...t) => new z(...t);
  #t = {
    detail: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(t = null, ...e) {
    this.#t.effects = new class {
      #e = {};
      constructor(h, l) {
        this.#e.owner = h, this.#e.registry = l;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(h, ...l) {
        const f = (() => {
          const g = l.find((_) => p.function(_));
          if (g)
            return g;
          const x = l.find((_) => Array.isArray(_));
          if (x)
            return (_) => x.includes(_);
        })(), {
          data: y = {},
          once: j,
          run: S = !0
        } = l.find((g, x) => !x && p.object(g)) || {}, v = (() => {
          const g = { data: { ...y } };
          return f && (g.condition = f), j && (g.once = j), g;
        })();
        if (this.#e.registry.set(h, v), S) {
          const g = C.create(this.#e.owner);
          g.detail = v, g.effect = h, (!f || f(this.#e.owner.current, g)) && h(this.#e.owner.current, g);
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
    const s = e.find((d) => p.object(d)) || {}, {
      detail: n,
      hooks: i,
      match: o = function(d) {
        return this.current === d;
      },
      name: c,
      owner: u
    } = s, a = e.filter((d) => p.function(d));
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
    const i = C.create(this);
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
      get(l, f) {
        return f === "effects" ? e.effects : f in e && p.function(e[f]) ? e[f].bind(e) : e.#t.current[f];
      },
      set(l, f, y) {
        return E.if(
          f === "effects" || f in e && p.function(e[f]),
          `Reserved key: ${f}.`
        ), e.update({ [f]: y }), !0;
      },
      apply(l, f, y) {
        return e.update(...y);
      },
      deleteProperty(l, f) {
        e.update({ [f]: void 0 });
      },
      has(l, f) {
        return f in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(f, ...y) {
        const {
          data: j,
          hooks: S,
          once: v = !1,
          run: g = !0
        } = y.find((b, T) => !T && p.object(b)) || {}, x = y.filter((b) => p.function(b)), _ = z.create({ owner: e }), L = e.effects.add(
          (b, T) => {
            _.update(f(b, T));
          },
          { data: j, once: v, run: g }
        );
        this.#e.registry.set(_, L);
        for (const b of x)
          _.effects.add(b, { once: v, run: g });
        if (S)
          for (const b of S)
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
          const _ = y.find((b) => p.function(b));
          if (_)
            return _;
          const L = y.find((b) => Array.isArray(b));
          if (L)
            return (b) => {
              for (const T of L)
                if (T in b)
                  return !0;
              return !1;
            };
        })(), {
          data: S = {},
          once: v,
          run: g = !0
        } = y.find((_) => p.object(_)) || {}, x = (() => {
          const _ = { data: { ...S } };
          return j && (_.condition = j), v && (_.once = v), _;
        })();
        if (this.#e.registry.set(f, x), g) {
          const _ = C.create(this.#e.owner);
          _.detail = x, _.effect = f, (!j || j(this.#e.owner.current, _)) && f(this.#e.owner.current, _);
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
    const s = {
      ...t.find((l, f) => !f && p.object(l)) || {}
    }, n = t.find((l, f) => f && p.object(l)) || {}, { config: i = {}, detail: o, hooks: c, name: u, owner: a } = n, { match: d } = i, h = t.filter((l) => p.function(l));
    this.#t.owner = a, this.#t.name = u, o && (this.#t.detail = o), this.config.match = d, this.update(s);
    for (const l of h)
      this.effects.add(l);
    if (c)
      for (const l of c)
        l.call(this);
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
    else if (p.object(t))
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
    const { detail: s, silent: n = !1 } = t.find((u, a) => a && p.object(u)) || {};
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
    const o = C.create(this);
    let c = 0;
    for (const [u, a] of this.#t.registry.entries()) {
      o.detail = a, o.effect = u, o.index = c++;
      const { condition: d, once: h } = a;
      if ((!d || d(this.change, o)) && (u(this.change, o), h && this.effects.remove(u), o.stopped))
        break;
    }
    return this;
  }
}
const ne = (...r) => A.create(...r).$, ie = (...r) => {
  const t = z.create(...r);
  return new Proxy(() => {
  }, {
    get(e, s) {
      E.if(!(s in t), `Invalid key: ${s}`);
      const n = t[s];
      return p.function(n) ? n.bind(t) : n;
    },
    set(e, s, n) {
      return E.if(!(s in t), `Invalid key: ${s}`), t[s] = n, !0;
    },
    apply(e, s, n) {
      return t.update(...n), t.current;
    }
  });
}, G = "$", ot = G.length, J = (r) => class extends r {
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
        Object.entries(t).filter(([e, s]) => e.startsWith(G)).map(([e, s]) => [e.slice(ot), s])
      )
    ), this;
  }
}, oe = (r) => class extends r {
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
class ct {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((t, e) => m(t) === "Object") || {}), this.#t.updates;
  }
}
const Z = (r) => (...t) => {
  t = new ct(t);
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
}, Q = (r, t, ...e) => {
  let s = r;
  for (const n of e)
    s = n(s, t, ...e);
  return s;
}, ut = (r, t) => class extends r {
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
function O(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function ce(r) {
  return r.length ? r[0].toUpperCase() + r.slice(1) : r;
}
function ue(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase());
}
function ae(r) {
  return String(r).toLowerCase().replace(/[-_\s]+([a-z0-9])/g, (t, e) => e.toUpperCase()).replace(/^([a-z])/, (t, e) => e.toUpperCase());
}
function fe(r) {
  return r.replaceAll("-", "_");
}
function le(r) {
  return r.length ? r[0].toLowerCase() + r.slice(1) : r;
}
function he(r, { numbers: t = !1 } = {}) {
  return t ? String(r).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase() : String(r).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/^([A-Z])/, (e) => e.toLowerCase()).toLowerCase();
}
const de = (r) => /^[A-Z]/.test(r), pe = (r) => (r.length > 0 && (r = r[0].toUpperCase() + r.slice(1)), r), at = (r, t) => class extends r {
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
        if (i = O(i), !e.hasAttribute(i))
          return null;
        const o = e.getAttribute(i);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(i) {
        return i = O(i), e.hasAttribute(i);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(s, (i) => i.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(i, o) {
        if (i = O(i), o === void 0)
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
class ft {
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
const lt = (r, t) => class extends r {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new ft(this), this.#t.class = new Proxy(() => {
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
}, ht = (r, t) => class extends r {
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
}, dt = (r, t) => class extends r {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, pt = 5, _t = (r, t) => class extends r {
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
        Object.entries(e).filter(([s, n]) => s.startsWith("data.")).map(([s, n]) => [`data-${s.slice(pt)}`, n])
      )
    ), this;
  }
}, mt = (r, t) => class extends r {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, gt = (r, t) => class extends r {
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
}, yt = (r, t) => class extends r {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
  bind(e) {
    return e.id = e.uid, this.setAttribute("for", e.id), this;
  }
}, bt = (r, t) => class extends r {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class wt {
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
const jt = (r, t, ...e) => class extends r {
  static __name__ = "insert";
  #t = {};
  __new__(...s) {
    super.__new__?.(...s), this.#t.insert = new wt(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
};
class I {
  static create = (...t) => new I(...t);
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
const me = (r, t, e, {
  bind: s = !0,
  configurable: n = !0,
  enumerable: i = !0,
  writable: o = !0
} = {}) => (s && (e = e.bind(r)), Object.defineProperty(r, t, {
  configurable: n,
  enumerable: i,
  writable: o,
  value: e
}), r), ge = (r, t, { bind: e = !0, configurable: s = !0, enumerable: n = !1, get: i, set: o } = {}) => {
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
}), r), xt = 3;
class vt {
  #t = {};
  constructor(t) {
    this.#t.registry = I.create(), this.#t.owner = t;
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
const Et = (r, t) => class extends r {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const s = this;
    this.#t.registry = new vt(this);
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
              const h = d.find((f) => typeof f == "function"), l = d.find((f) => R(f) === "Object") || {};
              if (a === "use")
                return s.addEventListener(c, h, l);
              if (a === "unuse")
                return s.removeEventListener(c, h, l);
              throw new Error(`Invalid key: ${a}`);
            };
          },
          apply(u, a, d) {
            const h = d.find((f) => typeof f == "function"), l = d.find((f) => R(f) === "Object") || {};
            return s.addEventListener(c, h, l);
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
    } = s.find((h, l) => l && R(h) === "Object") || {};
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
      const h = this.constructor.create();
      h.addEventListener(
        n,
        (l) => {
          M(l, "currentTarget", this), M(l, "target", this), M(l, "noevent", !0), i(l, d);
        },
        { once: !0 }
      ), n.startsWith("_") || n.includes("-") ? h.dispatchEvent(new CustomEvent(n)) : `on${n}` in h && n in h && typeof h[n] == "function" ? h[n]() : h.dispatchEvent(new Event(n));
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
        const [o, ...c] = n.slice(xt).split("."), u = Object.fromEntries(c.map((a) => [a, !0]));
        this.addEventListener(o, i, u);
      }
    return this;
  }
}, At = (r, t) => class extends r {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(e) {
    this.#t.owner = e, this.attribute && (this.attribute = e && "uid" in e ? e.uid : e);
  }
}, Ot = (r, t) => class extends r {
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
}, $t = (r, t) => class extends r {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, n] of Object.entries(e))
      s.startsWith("__") || !(s in this) && !s.startsWith("_") || n !== void 0 && this[s] !== n && (this[s] = n);
    return this;
  }
}, St = (r, t) => class extends r {
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
}, Ct = (r, t) => class extends r {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, n] of Object.entries(e))
      s in this || s in this.style && n !== void 0 && (n === null ? n = "none" : n === 0 && (n = "0"), this.style[s] !== n && (this.style[s] = n));
    return this;
  }
}, Tt = (r, t, ...e) => class extends r {
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
}, zt = (r, t) => class extends r {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, Lt = (r, t) => class extends r {
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
let Rt = 0;
const Pt = (r, t) => class extends r {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e);
    const s = `uid${Rt++}`;
    this.setAttribute("uid", s);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, kt = (r, t) => class extends r {
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
}, Mt = 9, Wt = -3, U = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": ut,
        "./mixins/attrs.js": at,
        "./mixins/classes.js": lt,
        "./mixins/clear.js": ht,
        "./mixins/connect.js": dt,
        "./mixins/data.js": _t,
        "./mixins/detail.js": mt,
        "./mixins/find.js": gt,
        "./mixins/for_.js": yt,
        "./mixins/hook.js": bt,
        "./mixins/insert.js": jt,
        "./mixins/on.js": Et,
        "./mixins/owner.js": At,
        "./mixins/parent.js": Ot,
        "./mixins/props.js": $t,
        "./mixins/send.js": St,
        "./mixins/style.js": Ct,
        "./mixins/super_.js": Tt,
        "./mixins/tab.js": zt,
        "./mixins/text.js": Lt,
        "./mixins/uid.js": Pt,
        "./mixins/vars.js": kt
      })
    ).map(([r, t]) => [r.slice(Mt, Wt), t])
  )
), tt = (...r) => {
  const t = r.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = r.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), s = r.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const n = Object.entries(U).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
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
}(), Nt = (r) => {
  const t = `x-${r}`;
  if (W.has(t))
    return W.get(t);
  const e = document.createElement(r), s = e.constructor;
  if (s === HTMLUnknownElement)
    throw new Error(`'${r}' is not native.`);
  const n = tt("!text", J);
  return "textContent" in e && n.push(U.text), r === "label" && n.push(U.for_), W.add(
    class et extends Q(s, {}, ...n) {
      static __key__ = t;
      static __native__ = r;
      static create = (...o) => {
        const c = new et();
        return Z(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, Ut = (r) => {
  const t = Nt(r), e = new t();
  return Z(e);
}, $ = new Proxy(
  {},
  {
    get(r, t, e) {
      return t === "from" ? (s, { as: n, convert: i = !0, ...o } = {}) => {
        if (i) {
          const c = Ht(s);
          return c.length === 1 ? n ? $[n](o, c[0]) : c[0].update(o) : $[n || "div"](o, ...c);
        }
        return $[n || "div"]({ innerHTML: s, ...o });
      } : Ut(t);
    }
  }
);
function Ht(r) {
  const t = document.createElement("div");
  return t.innerHTML = r, Array.from(t.children, (s) => Zt(s));
}
function K(r) {
  const t = $[r.tagName.toLowerCase()]();
  for (const { name: e, value: s } of Array.from(r.attributes))
    t.setAttribute(e, s);
  return t;
}
function Zt(r) {
  const t = K(r), e = Array.from(r.childNodes, (s) => [t, s]).reverse();
  for (; e.length; ) {
    const [s, n] = e.pop();
    if (n.nodeType === Node.TEXT_NODE) {
      s.append(document.createTextNode(n.textContent));
      continue;
    }
    if (n.nodeType !== Node.ELEMENT_NODE)
      continue;
    const i = K(n);
    s.append(i), e.push(...Array.from(n.childNodes, (o) => [i, o]).reverse());
  }
  return t;
}
const It = (r, t, e) => (W.add(r, t, e), M(r, "create", Z(r)), r.create);
console.log("Creating app component");
const Y = "div", Dt = It(
  class extends Q(
    document.createElement(Y).constructor,
    {},
    ...tt(J)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = $.slot(), this.#t.dataSlot = $.slot({ name: "data", display: null }), this.#t.shadow = $.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  ////
  Y
), w = Dt({ id: "app", parent: document.body }), qt = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
});
for (const [r, t] of Object.entries(qt)) {
  const e = window.matchMedia(`(width >= ${t}px)`), s = e.matches;
  w.$[r] = s, w.send(`_break_${r}`, { detail: s }), e.addEventListener("change", (n) => {
    const i = e.matches;
    w.$[r] = i, w.send(`_break_${r}`, { detail: i });
  });
}
const Kt = new ResizeObserver((r) => {
  setTimeout(() => {
    for (const t of r) {
      const e = t.contentRect.width, s = t.contentRect.height;
      w.$({ X: e, Y: s });
    }
  }, 0);
});
Kt.observe(w);
w.$.effects.add(
  (r) => {
    const { X: t, Y: e } = r;
    w.send("_resize"), t !== void 0 && w.send("_resize_x", { detail: t }), e !== void 0 && w.send("_resize_y", { detail: e });
  },
  ["X", "Y"]
);
const Yt = (r, t = !0) => t ? r.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : r.replace(/\s/g, ""), rt = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.get("sheet-reference") || customElements.define("sheet-reference", rt);
const st = new rt(), P = "@media";
class D {
  static create = (...t) => new D(...t);
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
      (t) => Yt(t.cssText)
    ).join(" ");
  }
  /* Adds rules. */
  add(t) {
    for (const [e, s] of Object.entries(t))
      this.#e(this.owner, this.#n(e, s), s);
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
    return this.#s(this.owner, this.#n(t));
  }
  /* Removes rules. */
  remove(...t) {
    return this.#o(this.owner, ...t);
  }
  /* Updates or creates rules. */
  update(t) {
    for (let [e, s] of Object.entries(t)) {
      e = this.#n(e, s);
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
    return e.startsWith(P) ? (e = e.slice(P.length).trim(), s.filter((n) => n instanceof CSSMediaRule).find((n) => n.conditionText === e) || null) : s.filter((n) => n instanceof CSSStyleRule).find((n) => n.selectorText === e) || null;
  }
  #i(t) {
    const e = Number(Object.keys(t)[0]);
    return typeof e == "number" && !Number.isNaN(e);
  }
  #n(t, e) {
    return !t.startsWith("@keyframes") && e && this.#i(e) ? `@keyframes ${t}` : t;
  }
  #o(t, ...e) {
    (!("cssRules" in t) || !("deleteRule" in t)) && E.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    for (let n of e) {
      let i;
      n.startsWith(P) ? (n = n.slice(P.length).trim(), i = s.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === n)) : i = s.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === n), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #r(t, e = {}) {
    t instanceof CSSRule || E.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [s, n] of Object.entries(e))
      if (n !== void 0) {
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = O(s.trim())), n === !1) {
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
    return t in st.style || t.startsWith("--");
  }
}
class q {
  static create = (...t) => new q(...t);
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
class N extends CSSStyleSheet {
  static create = (...t) => new N(...t);
  #t = {
    detail: {}
  };
  constructor(...t) {
    super(), this.#t.rules = D.create(this), this.#t.targets = q.create(this), this.#t.text = t.find((n, i) => !i && typeof n == "string"), this.#t.path = t.find((n, i) => i && typeof n == "string");
    const e = t.find((n) => m(n) === "Object"), s = t.find((n) => m(n) === "Object" && n !== e);
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
const Bt = document.documentElement, B = new class {
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
          return `var(--${O(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(r, t) {
          return getComputedStyle(Bt).getPropertyValue(`--${O(t, { numbers: !0 })}`).trim();
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
}(), Vt = new class {
  max(r) {
    return `@media (width <= ${r})`;
  }
  min(r) {
    return `@media (width >= ${r})`;
  }
}(), Xt = (r, t) => {
  if (!t.length) return N.create(r[0]);
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return N.create(e);
}, be = new Proxy(() => {
}, {
  get(r, t) {
    return t in B ? B[t] : t in st.style ? new Proxy(
      {},
      {
        get(e, s) {
          return { [t]: O(s, { numbers: !0 }) };
        }
      }
    ) : t === "media" ? Vt : (e) => `${e}${t === "pct" ? "%" : t}`;
  },
  apply(r, t, e) {
    const s = e.at(0);
    if (Array.isArray(s)) {
      const [n, ...i] = e;
      return Xt(n, i);
    }
    return s instanceof HTMLElement && "uid" in s ? `[uid="${s.uid}"]` : (e = e.map((n) => n === "!" ? "!important" : n), e.join(" "));
  }
});
class nt {
  static create = (...t) => new nt(...t);
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
      const s = new FileReader();
      s.onload = () => {
        t(s.result);
      }, s.onerror = () => e(s.error), s.readAsDataURL(this.file);
    });
  }
  /* Use for sending the file representation with `postMessage`. */
  async dto({ auto: t = !0, encoding: e = "binary" } = {}) {
    if (!H.encodings.includes(e))
      throw new Error(`Unsupported encoding: ${e}`);
    t && e !== "text" && await this.isText() && (e = "text");
    let s;
    return e === "base64" ? s = await this.base64() : e === "binary" ? s = await this.binary() : e === "dataURL" ? s = await this.dataURL() : e === "text" && (s = await this.text()), {
      content: s,
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
      const e = await this.file.slice(0, 5120).arrayBuffer(), s = new Uint8Array(e);
      return !new TextDecoder("utf-8", { fatal: !0 }).decode(s).includes("\0");
    } catch {
      return !1;
    }
  }
}
const we = (r) => {
  if (p.object(r))
    return Object.keys(r).forEach((t) => delete r[t]), r;
  if (p.map(r) || p.set(r))
    return r.clear(), r;
  if (p.array(r))
    return r.length = 0, r;
};
function je(r) {
  return new Promise((t) => setTimeout(t, r));
}
function it(...r) {
  if (this.update)
    return this.update(...r);
  this.update = it.bind(this), this.setAttribute("element", "");
  const t = r.find((c, u) => !u && typeof c == "string"), e = r.find((c, u) => u && typeof c == "string"), s = r.find((c) => m(c) === "Object") || {}, n = (() => {
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
      V.call(this, a, u);
      continue;
    }
    if (c.startsWith("data.")) {
      const a = `data-${c.slice(5)}`;
      V.call(this, a, u);
      continue;
    }
    if (c.startsWith("on.")) {
      const [a, ...d] = c.slice(3).split("."), h = Object.fromEntries(d.map((l) => [l, !0]));
      this.addEventListener(a, u, h);
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
const xe = new Proxy(
  {},
  {
    get(r, t) {
      return (...e) => {
        const s = document.createElement(t);
        return it.call(s, ...e), s;
      };
    }
  }
);
function V(r, t) {
  t === !1 || t === null ? this.removeAttribute(r) : t === !0 ? this.setAttribute(r, "") : this.setAttribute(r, t);
}
const X = (r, t) => {
  t && typeof t == "object" && r.push(t);
}, ve = (r) => {
  const t = [r];
  for (; t.length; ) {
    const e = t.pop();
    if (Object.freeze(e), p.map(e) || p.set(e)) {
      for (const s of e.values())
        X(t, s);
      continue;
    }
    for (const s of Object.values(e))
      X(t, s);
  }
  return r;
}, Ft = (r, t) => {
  if (!t.length) return r[0];
  let e = r[0];
  for (let s = 0; s < t.length; s++)
    e += String(t[s]) + r[s + 1];
  return e;
}, Ee = (r, ...t) => Ft(r, t), F = (r) => Object.fromEntries(
  Object.entries(r).filter(([t, e]) => e !== void 0)
), Ae = (r, t, e = (s, n) => s === n) => {
  const s = [[r, t]];
  for (; s.length > 0; ) {
    const [n, i] = s.pop(), [o, c] = [m(n), m(i)];
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
      const [u, a] = [F(n), F(i)], d = Object.keys(u);
      if (d.length !== Object.keys(a).length) return !1;
      for (const h of d) {
        if (!(h in a)) return !1;
        s.push([u[h], a[h]]);
      }
    }
  }
  return !0;
}, Oe = (r, t, e) => {
  const s = [[r, t]];
  for (; s.length; ) {
    const [n, i] = s.pop();
    for (const [o, c] of Object.entries(i)) {
      if (c === void 0) {
        delete n[o];
        continue;
      }
      const u = n[o], a = [m(u), m(c)];
      if (a.every(p.object)) {
        s.push([u, c]);
        continue;
      }
      n[o] = e && a.every(p.array) ? e(u, c) : c;
    }
  }
  return r;
}, $e = (r, ...t) => (t.forEach(
  (e) => Object.defineProperties(
    r,
    Object.getOwnPropertyDescriptors(e.prototype)
  )
), r);
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
const Gt = (r, ...t) => {
  if (p.object(r)) {
    for (const e of t)
      delete r[e];
    return r;
  }
  if (p.map(r)) {
    for (const e of t)
      r.delete(e);
    return r;
  }
  if (p.set(r)) {
    for (const e of t)
      r.delete(e);
    return r;
  }
  if (p.array(r)) {
    if (!r.length || !t.length) return r;
    for (let e = t.length - 1; e >= 0; e--)
      t.includes(r[e]) && r.splice(e, 1);
    return r;
  }
}, k = (r) => r.length === 1 ? r[0] : r, Ce = (r, ...t) => {
  if (p.object(r)) {
    const e = t.map((s) => {
      const n = r[s];
      return delete r[s], n;
    });
    return k(e);
  }
  if (p.map(r)) {
    const e = t.map((s) => {
      const n = r.get(s);
      return r.delete(s), n;
    });
    return k(e);
  }
  if (p.set(r)) {
    for (const e of t)
      r.delete(e);
    return k(t);
  }
  if (p.array(r))
    return Gt(r, ...t), k(t);
};
function Jt(r) {
  let t = r.parentElement;
  for (; t && t !== document.body; ) {
    const e = getComputedStyle(t), s = /(auto|scroll)/.test(e.overflowY), n = t.scrollHeight > t.clientHeight;
    if (s && n)
      return t;
    t = t.parentElement;
  }
  return window;
}
function Te(r) {
  Jt(r).scrollTo({ top: 0, behavior: "smooth" });
}
const ze = (r) => Array.from(new Set(r)), Le = (r, t = (e) => e) => {
  const e = [];
  for (let s = 0; s < r; s++)
    e.push(t(s, e));
  return e;
}, Re = (r, t, { abs: e = 1e-4, rel: s = 1e-6 } = {}) => {
  if (r === t) return !0;
  const n = Math.abs(r - t);
  return n <= e || n <= Math.max(Math.abs(r), Math.abs(t)) * s;
}, Pe = (r, { decimals: t = 2, banker: e = !1 } = {}) => {
  const s = 10 ** t, n = r * s, i = Math.round(n);
  return e && Math.abs(n % 1) === 0.5 ? Math.floor(n / 2) * 2 / s : i / s;
}, ke = (r, t) => ((() => {
  const e = ([s, n]) => n !== void 0;
  r = Object.fromEntries(Object.entries(r).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(r).filter(([e, s]) => t[e] !== s)
)), Me = (r, t) => ((() => {
  const e = ([s, n]) => n !== void 0;
  r = Object.fromEntries(Object.entries(r).filter(e)), t = Object.fromEntries(Object.entries(t).filter(e));
})(), Object.fromEntries(
  Object.entries(r).filter(
    ([e, s]) => e in t && t[e] === s
  )
));
export {
  Ut as Component,
  E as Exception,
  nt as Future,
  H as InputFile,
  tt as Mixins,
  A as Reactive,
  z as Ref,
  N as Sheet,
  I as TaggedSets,
  w as app,
  It as author,
  qt as breakpoints,
  O as camelToKebab,
  ce as camelToPascal,
  pe as capitalize,
  we as clear,
  $ as component,
  be as css,
  ze as deduplicate,
  me as defineMethod,
  ge as defineProperty,
  M as defineValue,
  je as delay,
  xe as element,
  Re as equal,
  Z as factory,
  ve as freeze,
  Ee as html,
  p as is,
  de as isUpper,
  ue as kebabToCamel,
  ae as kebabToPascal,
  fe as kebabToSnake,
  Ae as match,
  Oe as merge,
  Q as mix,
  U as mixins,
  $e as mixup,
  ke as objectDifference,
  Me as objectIntersection,
  le as pascalToCamel,
  he as pascalToKebab,
  Se as pipe,
  Ce as pop,
  Le as range,
  ne as reactive,
  ie as ref,
  oe as refMixin,
  W as registry,
  Gt as remove,
  Pe as round,
  J as stateMixin,
  Te as toTop,
  m as type,
  R as typeName,
  it as updateElement
};

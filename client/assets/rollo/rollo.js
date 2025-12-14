const p = (n) => Object.prototype.toString.call(n).slice(8, -1), E = new class {
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
    return t.includes(p(n));
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
}(), j = new class {
  if(t, e, s) {
    typeof t == "function" && (t = t()), t && this.raise(e, s);
  }
  raise(t, e) {
    throw e?.(), new Error(t);
  }
}();
class A {
  static create = (...t) => new A(...t);
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
class C {
  static create = (...t) => new C(...t);
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
        const c = (() => {
          const y = f.find((_) => typeof _ == "function");
          if (y)
            return y;
          const w = f.find((_) => Array.isArray(_));
          if (w)
            return (_) => w.includes(_);
        })(), {
          data: m = {},
          once: b,
          run: $ = !0
        } = f.find((y, w) => !w && p(y) === "Object") || {}, x = (() => {
          const y = { data: { ...m } };
          return c && (y.condition = c), b && (y.once = b), y;
        })();
        if (this.#e.registry.set(d, x), $) {
          const y = A.create(this.#e.owner);
          y.detail = x, y.effect = d, (!c || c(this.#e.owner.current, y)) && d(this.#e.owner.current, y);
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
      detail: r,
      match: i = function(l) {
        return this.current === l;
      },
      name: o,
      owner: u
    } = s, a = t.filter((l) => E.arrow(l)), h = t.filter((l) => !E.arrow(l) && typeof l == "function");
    this.match = i, this.#t.name = o, this.#t.owner = u, Object.assign(this.detail, r), this.update(e);
    for (const l of a)
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
    const i = A.create(this);
    let o = 0;
    for (const [u, a] of this.#t.registry.entries()) {
      i.detail = a, i.effect = u, i.index = o++;
      const { condition: h, once: l } = a;
      if ((!h || h(this.current, i, ...r)) && (u(this.current, i, ...r), l && this.effects.remove(u, ...r), i.stopped))
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
      get(f, c) {
        return c === "effects" ? e.effects : c in e && typeof e[c] == "function" ? e[c].bind(e) : e.#t.current[c];
      },
      set(f, c, m) {
        return j.if(
          c === "effects" || c in e && typeof e[c] == "function",
          `Reserved key: ${c}.`
        ), e.update({ [c]: m }), !0;
      },
      apply(f, c, m) {
        return e.update(...m);
      },
      deleteProperty(f, c) {
        e.update({ [c]: void 0 });
      },
      has(f, c) {
        return c in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(c, ...m) {
        const {
          data: b,
          once: $ = !1,
          run: x = !0
        } = m.find((g, S) => !S && p(g) === "Object") || {}, y = m.filter((g) => E.arrow(g)), w = m.filter(
          (g) => !E.arrow(g) && typeof g == "function"
        ), _ = C.create({ owner: e }), P = e.effects.add(
          (g, S) => {
            _.update(c(g, S));
          },
          { data: b, once: $, run: x }
        );
        this.#e.registry.set(_, P);
        for (const g of y)
          _.effects.add(g, { once: $, run: x });
        for (const g of w)
          g.call(_);
        return _;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (c, m) => c === m
      };
      get match() {
        return this.#e.match;
      }
      set match(c) {
        c !== void 0 && (this.#e.match = c);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(c, m) {
        this.#e.owner = c, this.#e.registry = m;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(c, ...m) {
        const b = (() => {
          const _ = m.find((g) => typeof g == "function");
          if (_)
            return _;
          const P = m.find((g) => Array.isArray(g));
          if (P)
            return (g) => {
              for (const S of P)
                if (S in g)
                  return !0;
              return !1;
            };
        })(), {
          data: $ = {},
          once: x,
          run: y = !0
        } = m.find((_) => p(_) === "Object") || {}, w = (() => {
          const _ = { data: { ...$ } };
          return b && (_.condition = b), x && (_.once = x), _;
        })();
        if (this.#e.registry.set(c, w), y) {
          const _ = A.create(this.#e.owner);
          _.detail = w, _.effect = c, (!b || b(this.#e.owner.current, _)) && c(this.#e.owner.current, _);
        }
        return c;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(c) {
        return this.#e.registry.has(c);
      }
      remove(c) {
        this.#e.registry.delete(c);
      }
    }(this, this.#t.registry);
    const s = {
      ...t.find((f, c) => !c && p(f) === "Object") || {}
    }, r = t.find((f, c) => c && p(f) === "Object") || {}, { config: i = {}, detail: o, name: u, owner: a } = r, { match: h } = i, l = t.filter((f) => E.arrow(f)), d = t.filter((f) => !E.arrow(f) && typeof f == "function");
    this.#t.owner = a, this.#t.name = u, Object.assign(this.detail, o), this.config.match = h, this.update(s);
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
    let e = t.find((a, h) => !h);
    if (!e)
      return this;
    const { detail: s, silent: r = !1 } = t.find((a, h) => h && p(a) === "Object") || {};
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof O ? e = e.current : e = { ...e }, s && Object.assign(this.detail, { ...s });
    const i = {};
    for (const [a, h] of Object.entries(e))
      if (!this.config.match(h, this.#t.current[a])) {
        if (h === void 0) {
          a in this.#t.current && (i[a] = h, this.#t.previous[a] = this.#t.current[a], delete this.#t.current[a]);
          continue;
        }
        i[a] = h, this.#t.previous[a] = this.#t.current[a], this.#t.current[a] = h;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const o = A.create(this);
    let u = 0;
    for (const [a, h] of this.#t.registry.entries()) {
      o.detail = h, o.effect = a, o.index = u++;
      const { condition: l, once: d } = h;
      if ((!l || l(this.change, o)) && (a(this.change, o), d && this.effects.remove(a), o.stopped))
        break;
    }
    return this;
  }
}
const qt = (...n) => O.create(...n).$, Kt = (...n) => {
  const t = C.create(...n);
  return new Proxy(() => {
  }, {
    get(e, s) {
      j.if(!(s in t), `Invalid key: ${s}`);
      const r = t[s];
      return typeof r == "function" ? r.bind(t) : r;
    },
    set(e, s, r) {
      return j.if(!(s in t), `Invalid key: ${s}`), t[s] = r, !0;
    },
    apply(e, s, r) {
      return t.update(...r), t.current;
    }
  });
}, K = "$", Q = K.length, V = (n) => class extends n {
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
        Object.entries(t).filter(([e, s]) => e.startsWith(K)).map(([e, s]) => [e.slice(Q), s])
      )
    ), this;
  }
}, Vt = (n) => class extends n {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = C.create({ owner: this }), this.#t.ref.effects.add(
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
class X {
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
const k = (n) => (...t) => {
  t = new X(t);
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
}, D = (n, t, ...e) => {
  let s = n;
  for (const r of e)
    s = r(s, t, ...e);
  return s;
}, Y = (n, t) => class extends n {
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
function v(n, { numbers: t = !1 } = {}) {
  return t ? String(n).replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").replace(/([0-9])([A-Za-z])/g, "$1-$2").toLowerCase() : String(n).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
const tt = (n, t) => class extends n {
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
        if (i = v(i), !e.hasAttribute(i))
          return null;
        const o = e.getAttribute(i);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(i) {
        return i = v(i), e.hasAttribute(i);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(s, (i) => i.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(i, o) {
        if (i = v(i), o === void 0 || o === "...")
          return e;
        const u = this.#e(e.getAttribute(i));
        return o === u || ([!1, null].includes(o) ? e.removeAttribute(i) : o === !0 || !["number", "string"].includes(typeof o) ? e.setAttribute(i, "") : e.setAttribute(i, o), e.dispatchEvent(
          new CustomEvent("_attributes", {
            detail: Object.freeze({ name: i, current: o, previous: u })
          })
        )), e;
      }
      /* Updates one or more attribute values. Chainable with respect to component. */
      update(i = {}) {
        return Object.entries(i).forEach(([o, u]) => {
          this.set(o, u);
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
class et {
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
const st = (n, t) => class extends n {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.classes = new et(this), this.#t.class = new Proxy(
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
}, rt = (n, t) => class extends n {
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
}, nt = (n, t) => class extends n {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, it = 5, ot = (n, t) => class extends n {
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
        Object.entries(e).filter(([s, r]) => s.startsWith("data.")).map(([s, r]) => [`data-${s.slice(it)}`, r])
      )
    ), this;
  }
}, ct = (n, t) => class extends n {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, ut = (n, t) => class extends n {
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
}, at = (n, t) => class extends n {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(e) {
    e ? this.setAttribute("for", e) : this.removeAttribute("for");
  }
}, ft = (n, t) => class extends n {
  static __name__ = "hook";
  hook(e) {
    return e ? e.call(this) ?? this : this;
  }
};
class ht {
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
const lt = (n, t, ...e) => class extends n {
  static __name__ = "insert";
  #t = {};
  __new__(...s) {
    super.__new__?.(...s), this.#t.insert = new ht(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, dt = (n, t) => class extends n {
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
const L = (n, t, e, {
  bind: s = !0,
  configurable: r = !1,
  enumerable: i = !0,
  writable: o = !1
} = {}) => (s && e.bind && (e = e.bind(n)), Object.defineProperty(n, t, {
  configurable: r,
  enumerable: i,
  writable: o,
  value: e
}), n), _t = 3;
class pt {
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
const gt = (n, t) => class extends n {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const s = this;
    this.#t.registry = new pt(this);
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
        const u = o;
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
          get(a, h) {
            return (...l) => {
              const d = l.find((c) => typeof c == "function"), f = l.find((c) => p(c) === "Object") || {};
              if (h === "use")
                return s.addEventListener(u, d, f);
              if (h === "unuse")
                return s.removeEventListener(u, d, f);
              throw new Error(`Invalid key: ${h}`);
            };
          },
          apply(a, h, l) {
            const d = l.find((c) => typeof c == "function"), f = l.find((c) => p(c) === "Object") || {};
            return s.addEventListener(u, d, f);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(i, o, u) {
        const [a, ...h] = o.split(".");
        return s.addEventListener(
          a,
          u,
          Object.fromEntries(h.map((l) => [l, !0]))
        ), !0;
      },
      /* Enable syntax like:
      button.on({ click: (event) => console.log("Clicked") });
      button.on({ once: true }, { click: (event) => console.log("Clicked") });
      button.on("click", (event) => console.log("Clicked"));
      button.on("click", (event) => console.log("Clicked"), { once: true });
      */
      apply(i, o, u) {
        return s.addEventListener(...u);
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
      run: u = !1,
      track: a = !1,
      ...h
    } = s.find((d, f) => f && p(d) === "Object") || {};
    a && !o && this.#t.registry.add(r, i), super.addEventListener(r, i, { once: o, ...h });
    const l = {
      handler: i,
      once: o,
      remove: () => {
        this.removeEventListener(r, i, { track: a });
      },
      run: u,
      target: this,
      track: a,
      type: r,
      ...h
    };
    if (u) {
      const d = this.constructor.create();
      d.addEventListener(
        r,
        (f) => {
          L(f, "currentTarget", this), L(f, "target", this), L(f, "noevent", !0), i(f, l);
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
    const [r, i] = typeof s[0] == "string" ? s : Object.entries(s[0])[0], { track: o = !1, ...u } = s.find((a, h) => h && p(a) === "Object") || {};
    return o && this.#t.registry.remove(r, i), super.removeEventListener(r, i, u), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(s = {}) {
    super.update?.(s);
    for (const [r, i] of Object.entries(s))
      if (r.startsWith("on.")) {
        const [o, ...u] = r.slice(_t).split("."), a = Object.fromEntries(u.map((h) => [h, !0]));
        this.addEventListener(o, i, a);
      }
    return this;
  }
}, mt = (n, t) => class extends n {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(e) {
    this.#t.owner = e, this.attribute && (this.attribute = e && "uid" in e ? e.uid : e);
  }
}, yt = (n, t) => class extends n {
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
}, bt = (n, t) => class extends n {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, r] of Object.entries(e))
      s.startsWith("__") || !(s in this) && !s.startsWith("_") || r === void 0 || r === "..." || this[s] !== r && (typeof r == "function" ? r((i) => this[s] = i) : this[s] = r);
    return this;
  }
}, wt = (n, t) => class extends n {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(e, { detail: s, trickle: r, ...i } = {}) {
    const o = s === void 0 ? new Event(e, i) : new CustomEvent(e, { detail: s, ...i });
    if (this.dispatchEvent(o), r) {
      const u = typeof r == "string" ? this.querySelectorAll(r) : this.children;
      for (const a of u)
        a.dispatchEvent(o);
    }
    return o;
  }
}, xt = (n, t) => class extends n {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(e = {}) {
    super.update?.(e);
    for (let [s, r] of Object.entries(e))
      s in this || s in this.style && (r === void 0 || r === "..." || (r === null ? r = "none" : r === 0 && (r = "0"), this.style[s] !== r && (this.style[s] = r)));
    return this;
  }
}, vt = (n, t, ...e) => class extends n {
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
      set(i, o, u) {
        return r(o, u), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, jt = (n, t) => class extends n {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(e) {
    [!1, null].includes(e) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", e);
  }
}, Ot = (n, t) => class extends n {
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
let $t = 0;
const Et = (n, t) => class extends n {
  static __name__ = "uid";
  __new__(...e) {
    super.__new__?.(...e), this.setAttribute("uid", `uid${$t++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, At = (n, t) => class extends n {
  static __name__ = "vars";
  #t = {};
  constructor() {
    super(), this.#t.__ = new Proxy(this, {
      get(e, s) {
        if (s.startsWith("--") || (s = `--${s}`), e.isConnected) {
          const o = getComputedStyle(e).getPropertyValue(s).trim();
          if (!o) return !1;
          const u = e.style.getPropertyPriority(s);
          return u ? `${o} !${u}` : o === "none" ? null : o;
        }
        const r = e.style.getPropertyValue(s);
        if (!r) return !1;
        const i = e.style.getPropertyPriority(s);
        return i ? `${r} !${i}` : r === "none" ? null : r;
      },
      set(e, s, r) {
        if (s.startsWith("--") || (s = `--${s}`), r === null ? r = "none" : r === 0 && (r = "0"), r === void 0 || r === "...")
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
}, St = 9, Ct = -3, W = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": Y,
        "./mixins/attrs.js": tt,
        "./mixins/classes.js": st,
        "./mixins/clear.js": rt,
        "./mixins/connect.js": nt,
        "./mixins/data.js": ot,
        "./mixins/detail.js": ct,
        "./mixins/find.js": ut,
        "./mixins/for_.js": at,
        "./mixins/hook.js": ft,
        "./mixins/insert.js": lt,
        "./mixins/novalidation.js": dt,
        "./mixins/on.js": gt,
        "./mixins/owner.js": mt,
        "./mixins/parent.js": yt,
        "./mixins/props.js": bt,
        "./mixins/send.js": wt,
        "./mixins/style.js": xt,
        "./mixins/super_.js": vt,
        "./mixins/tab.js": jt,
        "./mixins/text.js": Ot,
        "./mixins/uid.js": Et,
        "./mixins/vars.js": At
      })
    ).map(([n, t]) => [n.slice(St, Ct), t])
  )
), F = (...n) => {
  const t = n.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), e = n.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), s = n.filter((i) => typeof i == "function");
  e.push("for_", "novalidation");
  const r = Object.entries(W).filter(([i, o]) => t.includes(i) ? !0 : !e.includes(i)).map(([i, o]) => o);
  return r.push(...s), r;
}, T = new class {
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
}(), Pt = (n, t, e) => (T.add(n, t, e), L(n, "create", k(n)), n.create), Rt = (n) => {
  const t = `x-${n}`;
  if (T.has(t))
    return T.get(t);
  const e = document.createElement(n), s = e.constructor;
  if (s === HTMLUnknownElement)
    throw new Error(`'${n}' is not native.`);
  const r = F("!text", V);
  return "textContent" in e && r.push(W.text), n === "form" && r.push(W.novalidation), n === "label" && r.push(W.for_), T.add(
    class G extends D(s, {}, ...r) {
      static __key__ = t;
      static __native__ = n;
      static create = (...o) => {
        const u = new G();
        return k(u)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, zt = (n) => {
  const t = Rt(n), e = new t();
  return k(e);
}, M = new Proxy(
  {},
  {
    get(n, t) {
      return zt(t);
    }
  }
), Z = "div", Lt = Pt(
  class extends D(
    document.createElement(Z).constructor,
    {},
    ...F(V)
  ) {
    #t = {};
    constructor() {
      super(), this.#t.slot = M.slot(), this.#t.dataSlot = M.slot({ name: "data", display: null }), this.#t.shadow = M.div(
        { id: "root" },
        this.#t.slot,
        this.#t.dataSlot
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), this.attribute.app = !0, this.attribute.webComponent = !0;
    }
  },
  "app-component",
  Z
), R = Lt({ id: "app", parent: document.body }), Wt = Object.freeze({
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
});
for (const [n, t] of Object.entries(Wt)) {
  const e = window.matchMedia(`(width >= ${t}px)`), s = e.matches;
  R.$[n] = s, R.send(`_break_${n}`, { detail: s }), e.addEventListener("change", (r) => {
    const i = e.matches;
    R.$[n] = i, R.send(`_break_${n}`, { detail: i });
  });
}
const Tt = (n, t = !0) => t ? n.replace(/[^\S ]/g, "").replace(/ {2,}/g, " ").trim() : n.replace(/\s/g, ""), U = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", U);
const B = new U(), z = "@media";
class N {
  static create = (...t) => new N(...t);
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
      (t) => Tt(t.cssText)
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
    return this.#r(this.owner, this.#n(t));
  }
  /* Removes rules. */
  remove(...t) {
    return this.#o(this.owner, ...t);
  }
  /* Updates or creates rules. */
  update(t) {
    for (let [e, s] of Object.entries(t)) {
      e = this.#n(e, s);
      const r = this.#r(this.owner, e);
      if (r) {
        if (r instanceof CSSStyleRule)
          this.#s(r, s);
        else if (r instanceof CSSMediaRule)
          for (const [i, o] of Object.entries(s)) {
            const u = this.#r(r, i);
            u ? this.#s(u, o) : this.#e(r, i, o);
          }
        else if (r instanceof CSSKeyframesRule)
          for (const [i, o] of Object.entries(s)) {
            const u = r.findRule(`${i}%`);
            u ? this.#s(u, o) : this.#e(r, selector, o);
          }
      } else
        this.#e(this.owner, e, s);
    }
    return this;
  }
  #e(t, e, s) {
    (!("cssRules" in t) || !("insertRule" in t)) && j.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const r = t.cssRules[t.insertRule(`${e} { }`, t.cssRules.length)];
    if (r instanceof CSSStyleRule)
      return this.#s(r, s);
    if (r instanceof CSSMediaRule) {
      for (const [i, o] of Object.entries(s))
        this.#e(r, i, o);
      return r;
    }
    if (r instanceof CSSKeyframesRule) {
      for (const [i, o] of Object.entries(s))
        r.appendRule(`${i}% { }`), this.#s(r.findRule(`${i}%`), o);
      return r;
    }
  }
  #r(t, e) {
    "cssRules" in t || j.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    return e.startsWith(z) ? (e = e.slice(z.length).trim(), s.filter((r) => r instanceof CSSMediaRule).find((r) => r.conditionText === e) || null) : s.filter((r) => r instanceof CSSStyleRule).find((r) => r.selectorText === e) || null;
  }
  #i(t) {
    const e = Number(Object.keys(t)[0]);
    return typeof e == "number" && !Number.isNaN(e);
  }
  #n(t, e) {
    return t.startsWith("max") ? `@media (width <= ${t.slice(3)}px)` : t.startsWith("min") ? `@media (width >= ${t.slice(3)}px)` : !t.startsWith("@keyframes") && e && this.#i(e) ? `@keyframes ${t}` : t;
  }
  #o(t, ...e) {
    (!("cssRules" in t) || !("deleteRule" in t)) && j.raise(
      "Invalid container.",
      () => console.error("container:", t)
    );
    const s = Array.from(t.cssRules);
    for (let r of e) {
      let i;
      r.startsWith(z) ? (r = r.slice(z.length).trim(), i = s.filter((o) => o instanceof CSSMediaRule).findIndex((o) => o.conditionText === r)) : i = s.filter((o) => o instanceof CSSStyleRule).findIndex((o) => o.selectorText === r), i > -1 && t.deleteRule(i);
    }
    return t;
  }
  #s(t, e = {}) {
    t instanceof CSSRule || j.raise("Invalid rule.", () => console.error("rule:", t));
    for (let [s, r] of Object.entries(e))
      if (r !== void 0) {
        if (p(r) === "Object") {
          const [i, o] = Object.entries(r)[0];
          r = `${o}${i}`;
        }
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = v(s.trim())), r === !1) {
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
    return t in B.style || t.startsWith("--");
  }
}
class H {
  static create = (...t) => new H(...t);
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
const Mt = document.documentElement, q = new class {
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
          return `var(--${v(t, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(n, t) {
          return getComputedStyle(Mt).getPropertyValue(`--${v(t, { numbers: !0 })}`).trim();
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
          return v(t, { numbers: !0 });
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
}(), Ut = new Proxy(() => {
}, {
  get(n, t) {
    return t in q ? q[t] : t in B.style ? new Proxy(
      {},
      {
        get(e, s) {
          return { [t]: v(s, { numbers: !0 }) };
        }
      }
    ) : (e) => (t === "pct" && (t = "%"), `${e}${t}`);
  },
  apply(n, t, e) {
    return e = e.map((s) => s === "!" ? "!important" : s), e.join(" ");
  }
}), Bt = (n) => {
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
          return (...u) => (o(...u), s);
      }
      return i === "_" ? (t += " ", s) : (t += i, s);
    },
    apply(r, i, o) {
      const u = o[0];
      return p(u) === "Object" ? { [t]: u } : (t += u, s);
    }
  });
  return s;
}, Jt = (n) => `[uid="${n.uid}"]`;
class J extends CSSStyleSheet {
  static create = (...t) => new J(...t);
  #t = {
    detail: {}
  };
  constructor(...t) {
    super(), this.#t.rules = N.create(this), this.#t.targets = H.create(this), this.#t.text = t.find((r, i) => !i && typeof r == "string"), this.#t.path = t.find((r, i) => i && typeof r == "string");
    const e = t.find((r) => p(r) === "Object"), s = t.find((r) => p(r) === "Object" && r !== e);
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
export {
  j as Exception,
  F as Mixins,
  J as Sheet,
  R as app,
  Pt as author,
  Wt as breakpoints,
  M as component,
  Ut as css,
  k as factory,
  E as is,
  D as mix,
  W as mixins,
  qt as reactive,
  Kt as ref,
  Vt as refMixin,
  T as registry,
  Bt as rule,
  Jt as scope,
  V as stateMixin,
  p as type
};

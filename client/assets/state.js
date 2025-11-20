class $ {
  static create = (...t) => new $(...t);
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
const { type: W } = await use("@/tools/type.js"), { is: k } = await use("@/tools/is.js");
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
      constructor(d, n) {
        this.#e.owner = d, this.#e.registry = n;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(d, ...n) {
        const s = n.find((l) => typeof l == "function"), { data: h = {}, once: m, run: O = !0 } = n.find((l, v) => !v && W(l) === "Object") || {}, b = (() => {
          const l = { data: { ...h } };
          return s && (l.condition = s), m && (l.once = m), l;
        })();
        if (this.#e.registry.set(d, b), O) {
          const l = $.create(this.#e.owner);
          l.detail = b, l.effect = d, (!s || s(this.#e.owner.current, l)) && d(this.#e.owner.current, l);
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
    const e = t.find((o, d) => !d && W(o) !== "Object"), r = t.find((o) => W(o) === "Object") || {}, { detail: i, match: g = function(o) {
      return this.current === o;
    }, name: p, owner: w } = r, c = t.filter((o) => k.arrow(o)), u = t.filter((o) => !k.arrow(o) && typeof o == "function");
    this.match = g, this.#t.name = p, this.#t.owner = w, Object.assign(this.detail, i), this.update(e);
    for (const o of c)
      this.effects.add(o);
    for (const o of u)
      o.call(this);
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
  update(t, { detail: e, silent: r = !1 } = {}) {
    if (e && Object.assign(this.detail, e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const i = $.create(this);
    let g = 0;
    for (const [p, w] of this.#t.registry.entries()) {
      i.detail = w, i.effect = p, i.index = g++;
      const { condition: c, once: u } = w;
      if ((!c || c(this.current, i)) && (p(this.current, i), u && this.effects.remove(p), i.stopped))
        break;
    }
    return this;
  }
}
const { Exception: C } = await use("@/tools/exception.js"), { type: x } = await use("@/tools/type.js"), { is: A } = await use("@/tools/is.js");
class j {
  static create = (...t) => new j(...t);
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
      get(n, s) {
        return s === "effects" ? e.effects : s in e && typeof e[s] == "function" ? e[s].bind(e) : e.#t.current[s];
      },
      set(n, s, h) {
        return C.if(
          s === "effects" || s in e && typeof e[s] == "function",
          `Reserved key: ${s}.`
        ), e.update({ [s]: h }), !0;
      },
      apply(n, s, h) {
        return e.update(...h);
      },
      deleteProperty(n, s) {
        e.update({ [s]: void 0 });
      },
      has(n, s) {
        return s in e.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(s, ...h) {
        const {
          data: m,
          once: O = !1,
          run: b = !0
        } = h.find((f, _) => !_ && x(f) === "Object") || {}, l = h.filter((f) => A.arrow(f)), v = h.filter(
          (f) => !A.arrow(f) && typeof f == "function"
        ), a = z.create({ owner: e }), E = e.effects.add(
          (f, _) => {
            a.update(s(f, _));
          },
          { data: m, once: O, run: b }
        );
        this.#e.registry.set(a, E);
        for (const f of l)
          a.effects.add(f, { once: O, run: b });
        for (const f of v)
          f.call(a);
        return a;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (s, h) => s === h
      };
      get match() {
        return this.#e.match;
      }
      set match(s) {
        s !== void 0 && (this.#e.match = s);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(s, h) {
        this.#e.owner = s, this.#e.registry = h;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(s, ...h) {
        const m = (() => {
          const a = h.find((f) => typeof f == "function");
          if (a)
            return a;
          const E = h.find((f) => Array.isArray(f));
          if (E)
            return (f) => {
              for (const _ of E)
                if (_ in f)
                  return !0;
              return !1;
            };
        })(), {
          data: O = {},
          once: b,
          run: l = !0
        } = h.find((a) => x(a) === "Object") || {}, v = (() => {
          const a = { data: { ...O } };
          return m && (a.condition = m), b && (a.once = b), a;
        })();
        if (this.#e.registry.set(s, v), l) {
          const a = $.create(this.#e.owner);
          a.detail = v, a.effect = s, (!m || m(this.#e.owner.current, a)) && s(this.#e.owner.current, a);
        }
        return s;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(s) {
        return this.#e.registry.has(s);
      }
      remove(s) {
        this.#e.registry.delete(s);
      }
    }(this, this.#t.registry);
    const r = {
      ...t.find((n, s) => !s && x(n) === "Object") || {}
    }, i = t.find((n, s) => s && x(n) === "Object") || {}, { config: g = {}, detail: p, name: w, owner: c } = i, { match: u } = g, o = t.filter((n) => A.arrow(n)), d = t.filter((n) => !A.arrow(n) && typeof n == "function");
    this.#t.owner = c, this.#t.name = w, Object.assign(this.detail, p), this.config.match = u, this.update(r);
    for (const n of o)
      this.effects.add(n);
    for (const n of d)
      n.call(this);
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
    return j.create(
      { ...this.#t.current },
      { config: { match: this.config.match }, detail: { ...this.detail } }
    );
  }
  entries() {
    return Object.entries(this.#t.current);
  }
  filter(t, e = !1) {
    const r = {};
    for (const [i, g] of this.entries())
      t([i, g]) || (r[i] = void 0);
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
    if (t instanceof j)
      t = t.current;
    else if (x(t) === "Object")
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
  - Option for updating silently, i.e., non-reactively. */
  update(...t) {
    let e = t.find((c, u) => !u);
    if (!e)
      return this;
    const { detail: r, silent: i = !1 } = t.find((c, u) => u && x(c) === "Object") || {};
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof j ? e = e.current : e = { ...e }, r && Object.assign(this.detail, { ...r });
    const g = {};
    for (const [c, u] of Object.entries(e))
      if (!this.config.match(u, this.#t.current[c])) {
        if (u === void 0) {
          c in this.#t.current && (g[c] = u, this.#t.previous[c] = this.#t.current[c], delete this.#t.current[c]);
          continue;
        }
        g[c] = u, this.#t.previous[c] = this.#t.current[c], this.#t.current[c] = u;
      }
    if (!Object.keys(g).length) return this;
    if (this.#t.change = Object.freeze(g), this.#t.session++, i) return this;
    if (!this.effects.size) return this;
    const p = $.create(this);
    let w = 0;
    for (const [c, u] of this.#t.registry.entries()) {
      p.detail = u, p.effect = c, p.index = w++;
      const { condition: o, once: d } = u;
      if ((!o || o(this.change, p)) && (c(this.change, p), d && this.effects.remove(c), p.stopped))
        break;
    }
    return this;
  }
}
const D = (...y) => j.create(...y).$, { Exception: M } = await use("@/tools/exception.js"), F = (...y) => {
  const t = z.create(...y);
  return new Proxy(() => {
  }, {
    get(e, r) {
      M.if(!(r in t), `Invalid key: ${r}`);
      const i = t[r];
      return typeof i == "function" ? i.bind(t) : i;
    },
    set(e, r, i) {
      return M.if(!(r in t), `Invalid key: ${r}`), t[r] = i, !0;
    },
    apply(e, r, i) {
      return t.update(...i), t.current;
    }
  });
}, P = "$", I = P.length, G = (y) => class extends y {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = j.create({ owner: this }), this.#t.state.effects.add(
      (t, e) => {
        this.update(t);
        const r = Object.fromEntries(
          Object.entries(t).filter(([i, g]) => !(i in this && !i.startsWith("_")) && !(i in this.style) && !i.startsWith("[") && !i.startsWith(".") && !i.startsWith("__") && !i.startsWith("@")).map(([i, g]) => [`state-${i}`, g])
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
        Object.entries(t).filter(([e, r]) => e.startsWith(P)).map(([e, r]) => [e.slice(I), r])
      )
    ), this;
  }
}, H = (y) => class extends y {
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
export {
  j as Reactive,
  z as Ref,
  D as reactive,
  F as ref,
  H as refMixin,
  G as stateMixin
};

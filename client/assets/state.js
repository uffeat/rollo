class x {
  static create = (...t) => new x(...t);
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
const { type: A } = await use("@/tools/type.js"), { is: W } = await use("@/tools/is.js");
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
      constructor(g, n) {
        this.#e.owner = g, this.#e.registry = n;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(g, ...n) {
        const e = n.find((d) => typeof d == "function"), { data: a = {}, once: m, run: O = !0 } = n.find((d, v) => !v && A(d) === "Object") || {}, y = (() => {
          const d = { data: { ...a } };
          return e && (d.condition = e), m && (d.once = m), d;
        })();
        if (this.#e.registry.set(g, y), O) {
          const d = x.create(this.#e.owner);
          d.detail = y, d.effect = g, (!e || e(this.#e.owner.current, d)) && g(this.#e.owner.current, d);
        }
        return g;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(g) {
        return this.#e.registry.has(g);
      }
      remove(g) {
        this.#e.registry.delete(g);
      }
    }(this, this.#t.registry);
    const s = t.find((o, g) => !g && A(o) !== "Object"), r = t.find((o) => A(o) === "Object") || {}, { detail: i, match: h = function(o) {
      return this.current === o;
    }, name: p, owner: c } = r, l = t.filter((o) => W.arrow(o)), w = t.filter((o) => !W.arrow(o) && typeof o == "function");
    this.match = h, this.#t.name = p, this.#t.owner = c, Object.assign(this.detail, i), this.update(s);
    for (const o of l)
      this.effects.add(o);
    for (const o of w)
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
  update(t, { detail: s, silent: r = !1 } = {}) {
    if (s && Object.assign(this.detail, s), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const i = x.create(this);
    let h = 0;
    for (const [p, c] of this.#t.registry.entries()) {
      i.detail = c, i.effect = p, i.index = h++;
      const { condition: l, once: w } = c;
      if ((!l || l(this.current, i)) && (p(this.current, i), w && this.effects.remove(p), i.stopped))
        break;
    }
    return this;
  }
}
const { type: $ } = await use("@/tools/type.js"), { is: E } = await use("@/tools/is.js");
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
    const s = this;
    this.#t.$ = new Proxy(() => {
    }, {
      get(n, e) {
        return e === "_" ? s : typeof s[e] == "function" ? (...a) => s[e](...a) : s.#t.current[e];
      },
      set(n, e, a) {
        return s.update({ [e]: a }), !0;
      },
      apply(n, e, a) {
        return s.update(...a);
      },
      deleteProperty(n, e) {
        s.update({ [e]: void 0 });
      },
      has(n, e) {
        return e in s.#t.current;
      }
    }), this.#t.computed = new class {
      #e = {
        registry: /* @__PURE__ */ new Map()
      };
      add(e, ...a) {
        const {
          data: m,
          once: O = !1,
          run: y = !0
        } = a.find((f, _) => !_ && $(f) === "Object") || {}, d = a.filter((f) => E.arrow(f)), v = a.filter(
          (f) => !E.arrow(f) && typeof f == "function"
        ), u = z.create({ owner: s }), k = s.effects.add(
          (f, _) => {
            u.update(e(f, _));
          },
          { data: m, once: O, run: y }
        );
        this.#e.registry.set(u, k);
        for (const f of d)
          u.effects.add(f, { once: O, run: y });
        for (const f of v)
          f.call(u);
        return u;
      }
      /* TODO
      - remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (e, a) => e === a
      };
      get match() {
        return this.#e.match;
      }
      set match(e) {
        e !== void 0 && (this.#e.match = e);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(e, a) {
        this.#e.owner = e, this.#e.registry = a;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(e, ...a) {
        const m = (() => {
          const u = a.find((f) => typeof f == "function");
          if (u)
            return u;
          const k = a.find((f) => Array.isArray(f));
          if (k)
            return (f) => {
              for (const _ of k)
                if (_ in f)
                  return !0;
              return !1;
            };
        })(), {
          data: O = {},
          once: y,
          run: d = !0
        } = a.find((u) => $(u) === "Object") || {}, v = (() => {
          const u = { data: { ...O } };
          return m && (u.condition = m), y && (u.once = y), u;
        })();
        if (this.#e.registry.set(e, v), d) {
          const u = x.create(this.#e.owner);
          u.detail = v, u.effect = e, (!m || m(this.#e.owner.current, u)) && e(this.#e.owner.current, u);
        }
        return e;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(e) {
        return this.#e.registry.has(e);
      }
      remove(e) {
        this.#e.registry.delete(e);
      }
    }(this, this.#t.registry);
    const r = {
      ...t.find((n, e) => !e && $(n) === "Object") || {}
    }, i = t.find((n, e) => e && $(n) === "Object") || {}, { config: h = {}, detail: p, name: c, owner: l } = i, { match: w } = h, o = t.filter((n) => E.arrow(n)), g = t.filter((n) => !E.arrow(n) && typeof n == "function");
    this.#t.owner = l, this.#t.name = c, Object.assign(this.detail, p), this.config.match = w, this.update(r);
    for (const n of o)
      this.effects.add(n);
    for (const n of g)
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
    const s = this.keys().map((r) => [r, void 0]);
    return this.update(s, { silent: t });
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
  filter(t, s = !1) {
    const r = {};
    for (const [i, h] of this.entries())
      t([i, h]) || (r[i] = void 0);
    return this.update(r, { silent: s });
  }
  forEach(t) {
    return this.entries().forEach(t), this;
  }
  has(t) {
    return t in this.#t.current;
  }
  map(t, s = !1) {
    const r = this.entries().map(t);
    return this.update(r, { silent: s });
  }
  /* Tests if other contains the same non-undefined items as current.
  NOTE Does not participate in reactivity, but useful extra, especially for testing. */
  match(t) {
    if (t instanceof j)
      t = t.current;
    else if ($(t) === "Object")
      t = Object.fromEntries(
        Object.entries(t).filter(([s, r]) => r !== void 0)
      );
    else
      return !1;
    if (this.size !== Object.keys(t).length) return !1;
    for (const [s, r] of this.entries())
      if (!this.config.match(t[s], r)) return !1;
    return !0;
  }
  keys() {
    return Object.keys(this.#t.current);
  }
  values() {
    return Object.values(this.#t.current);
  }
  /* Updates current reactively.
  NOTE 
  - Option for updating silently, i.e., non-reactively. */
  update(t, { detail: s, silent: r = !1 } = {}) {
    Array.isArray(t) ? t = Object.fromEntries(t) : t instanceof j ? t = t.current : t = { ...t }, s && Object.assign(this.detail, { ...s });
    const i = {};
    for (const [c, l] of Object.entries(t))
      if (!this.config.match(l, this.#t.current[c])) {
        if (l === void 0) {
          c in this.#t.current && (i[c] = l, this.#t.previous[c] = this.#t.current[c], delete this.#t.current[c]);
          continue;
        }
        i[c] = l, this.#t.previous[c] = this.#t.current[c], this.#t.current[c] = l;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const h = x.create(this);
    let p = 0;
    for (const [c, l] of this.#t.registry.entries()) {
      h.detail = l, h.effect = c, h.index = p++;
      const { condition: w, once: o } = l;
      if ((!w || w(this.change, h)) && (c(this.change, h), o && this.effects.remove(c), h.stopped))
        break;
    }
    return this;
  }
}
const B = (...b) => j.create(...b).$, { Exception: M } = await use("@/tools/exception.js"), D = (...b) => {
  const t = z.create(...b);
  return new Proxy(() => {
  }, {
    get(s, r) {
      return M.if(!(r in t), `Invalid key: ${r}`), t[r];
    },
    set(s, r, i) {
      return M.if(!(r in t), `Invalid key: ${r}`), t[r] = i, !0;
    },
    apply(s, r, i) {
      return t.update(...i), t.current;
    }
  });
}, P = "$", C = P.length, F = (b) => class extends b {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = j.create({ owner: this }), this.#t.state.effects.add(
      (t, s) => {
        this.update(t);
        const r = Object.fromEntries(
          Object.entries(t).filter(([i, h]) => !(i in this && !i.startsWith("_")) && !(i in this.style) && !i.startsWith("[") && !i.startsWith(".") && !i.startsWith("__") && !i.startsWith("@")).map(([i, h]) => [`state-${i}`, h])
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
        Object.entries(t).filter(([s, r]) => s.startsWith(P)).map(([s, r]) => [s.slice(C), r])
      )
    ), this;
  }
}, G = (b) => class extends b {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = z.create({ owner: this }), this.#t.ref.effects.add(
      (t, s) => {
        this.attribute.current = t, this.attribute.previous = this.previous, this.attribute.session = this.session, this.send("_ref", { detail: Object.freeze({ current: t, message: s }) });
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
  B as reactive,
  D as ref,
  G as refMixin,
  F as stateMixin
};

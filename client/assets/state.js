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
const { type: W } = await use("@/tools/type"), { is: k } = await use("@/tools/is");
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
      constructor(p, n) {
        this.#e.owner = p, this.#e.registry = n;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(p, ...n) {
        const s = (() => {
          const l = n.find((c) => typeof c == "function");
          if (l)
            return l;
          const y = n.find((c) => Array.isArray(c));
          if (y)
            return (c) => y.includes(c);
        })(), {
          data: d = {},
          once: w,
          run: v = !0
        } = n.find((l, y) => !y && W(l) === "Object") || {}, b = (() => {
          const l = { data: { ...d } };
          return s && (l.condition = s), w && (l.once = w), l;
        })();
        if (this.#e.registry.set(p, b), v) {
          const l = $.create(this.#e.owner);
          l.detail = b, l.effect = p, (!s || s(this.#e.owner.current, l)) && p(this.#e.owner.current, l);
        }
        return p;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(p) {
        return this.#e.registry.has(p);
      }
      remove(p) {
        this.#e.registry.delete(p);
      }
    }(this, this.#t.registry);
    const e = t.find((u, p) => !p && W(u) !== "Object"), r = t.find((u) => W(u) === "Object") || {}, {
      detail: i,
      match: a = function(u) {
        return this.current === u;
      },
      name: g,
      owner: m
    } = r, o = t.filter((u) => k.arrow(u)), f = t.filter((u) => !k.arrow(u) && typeof u == "function");
    this.match = a, this.#t.name = g, this.#t.owner = m, Object.assign(this.detail, i), this.update(e);
    for (const u of o)
      this.effects.add(u);
    for (const u of f)
      u.call(this);
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
  update(t, { detail: e, silent: r = !1 } = {}, ...i) {
    if (e && Object.assign(this.detail, e), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, r) return this;
    if (!this.effects.size) return this;
    const a = $.create(this);
    let g = 0;
    for (const [m, o] of this.#t.registry.entries()) {
      a.detail = o, a.effect = m, a.index = g++;
      const { condition: f, once: u } = o;
      if ((!f || f(this.current, a, ...i)) && (m(this.current, a, ...i), u && this.effects.remove(m, ...i), a.stopped))
        break;
    }
    return this;
  }
}
const { Exception: C } = await use("@/tools/exception"), { type: x } = await use("@/tools/type"), { is: A } = await use("@/tools/is");
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
      get(n, s) {
        return s === "effects" ? e.effects : s in e && typeof e[s] == "function" ? e[s].bind(e) : e.#t.current[s];
      },
      set(n, s, d) {
        return C.if(
          s === "effects" || s in e && typeof e[s] == "function",
          `Reserved key: ${s}.`
        ), e.update({ [s]: d }), !0;
      },
      apply(n, s, d) {
        return e.update(...d);
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
      add(s, ...d) {
        const {
          data: w,
          once: v = !1,
          run: b = !0
        } = d.find((h, _) => !_ && x(h) === "Object") || {}, l = d.filter((h) => A.arrow(h)), y = d.filter(
          (h) => !A.arrow(h) && typeof h == "function"
        ), c = z.create({ owner: e }), E = e.effects.add(
          (h, _) => {
            c.update(s(h, _));
          },
          { data: w, once: v, run: b }
        );
        this.#e.registry.set(c, E);
        for (const h of l)
          c.effects.add(h, { once: v, run: b });
        for (const h of y)
          h.call(c);
        return c;
      }
      /* TODO
      - Implement: remove, size, etc. */
    }(), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (s, d) => s === d
      };
      get match() {
        return this.#e.match;
      }
      set match(s) {
        s !== void 0 && (this.#e.match = s);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(s, d) {
        this.#e.owner = s, this.#e.registry = d;
      }
      get owner() {
        return this.#e.owner;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(s, ...d) {
        const w = (() => {
          const c = d.find((h) => typeof h == "function");
          if (c)
            return c;
          const E = d.find((h) => Array.isArray(h));
          if (E)
            return (h) => {
              for (const _ of E)
                if (_ in h)
                  return !0;
              return !1;
            };
        })(), {
          data: v = {},
          once: b,
          run: l = !0
        } = d.find((c) => x(c) === "Object") || {}, y = (() => {
          const c = { data: { ...v } };
          return w && (c.condition = w), b && (c.once = b), c;
        })();
        if (this.#e.registry.set(s, y), l) {
          const c = $.create(this.#e.owner);
          c.detail = y, c.effect = s, (!w || w(this.#e.owner.current, c)) && s(this.#e.owner.current, c);
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
    }, i = t.find((n, s) => s && x(n) === "Object") || {}, { config: a = {}, detail: g, name: m, owner: o } = i, { match: f } = a, u = t.filter((n) => A.arrow(n)), p = t.filter((n) => !A.arrow(n) && typeof n == "function");
    this.#t.owner = o, this.#t.name = m, Object.assign(this.detail, g), this.config.match = f, this.update(r);
    for (const n of u)
      this.effects.add(n);
    for (const n of p)
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
    return O.create(
      { ...this.#t.current },
      { config: { match: this.config.match }, detail: { ...this.detail } }
    );
  }
  entries() {
    return Object.entries(this.#t.current);
  }
  filter(t, e = !1) {
    const r = {};
    for (const [i, a] of this.entries())
      t([i, a]) || (r[i] = void 0);
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
    if (t instanceof O)
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
    let e = t.find((o, f) => !f);
    if (!e)
      return this;
    const { detail: r, silent: i = !1 } = t.find((o, f) => f && x(o) === "Object") || {};
    Array.isArray(e) ? e = Object.fromEntries(e) : e instanceof O ? e = e.current : e = { ...e }, r && Object.assign(this.detail, { ...r });
    const a = {};
    for (const [o, f] of Object.entries(e))
      if (!this.config.match(f, this.#t.current[o])) {
        if (f === void 0) {
          o in this.#t.current && (a[o] = f, this.#t.previous[o] = this.#t.current[o], delete this.#t.current[o]);
          continue;
        }
        a[o] = f, this.#t.previous[o] = this.#t.current[o], this.#t.current[o] = f;
      }
    if (!Object.keys(a).length) return this;
    if (this.#t.change = Object.freeze(a), this.#t.session++, i) return this;
    if (!this.effects.size) return this;
    const g = $.create(this);
    let m = 0;
    for (const [o, f] of this.#t.registry.entries()) {
      g.detail = f, g.effect = o, g.index = m++;
      const { condition: u, once: p } = f;
      if ((!u || u(this.change, g)) && (o(this.change, g), p && this.effects.remove(o), g.stopped))
        break;
    }
    return this;
  }
}
const D = (...j) => O.create(...j).$, { Exception: M } = await use("@/tools/exception"), F = (...j) => {
  const t = z.create(...j);
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
}, P = "$", I = P.length, G = (j) => class extends j {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = O.create({ owner: this }), this.#t.state.effects.add(
      (t, e) => {
        this.update(t);
        const r = Object.fromEntries(
          Object.entries(t).filter(([i, a]) => !(i in this && !i.startsWith("_")) && !(i in this.style) && !i.startsWith("[") && !i.startsWith("data.") && !i.startsWith(".") && !i.startsWith("__") && !i.startsWith("on.")).map(([i, a]) => [`state-${i}`, a])
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
}, H = (j) => class extends j {
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
  O as Reactive,
  z as Ref,
  D as reactive,
  F as ref,
  H as refMixin,
  G as stateMixin
};

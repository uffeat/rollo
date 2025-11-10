class b {
  static create = (...t) => new b(...t);
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
const { typeName: _ } = await use("@/tools/types.js");
let N = class j {
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
      get(a, r) {
        return s.#t.current[r];
      },
      set(a, r, l) {
        return s.update({ [r]: l }), !0;
      },
      apply(a, r, l) {
        return s.update(...l);
      },
      deleteProperty(a, r) {
        s.update({ [r]: void 0 });
      },
      has(a, r) {
        return r in s.#t.current;
      }
    }), this.#t.config = new class {
      #e = {
        /* Default match */
        match: (r, l) => r === l
      };
      get match() {
        return this.#e.match;
      }
      set match(r) {
        r !== void 0 && (this.#e.match = r);
      }
    }(), this.#t.effects = new class {
      #e = {};
      constructor(r, l) {
        this.#e.owner = r, this.#e.registry = l;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(r, ...l) {
        const y = (() => {
          const p = l.find((v) => typeof v == "function");
          if (p)
            return p;
          const $ = l.find((v) => Array.isArray(v));
          if ($)
            return (v) => {
              for (const W of $)
                if (W in v)
                  return !0;
              return !1;
            };
        })(), {
          data: z = {},
          once: w,
          run: g = !0
        } = l.find((p, $) => !$ && _(p) === "Object") || {}, O = (() => {
          const p = { data: { ...z } };
          return y && (p.condition = y), w && (p.once = w), p;
        })();
        if (this.#e.registry.set(r, O), g) {
          const p = b.create(this.#e.owner);
          p.detail = O, p.effect = r, (!y || y(this.#e.owner.current, p)) && r(this.#e.owner.current, p);
        }
        return r;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(r) {
        return this.#e.registry.has(r);
      }
      remove(r) {
        this.#e.registry.delete(r);
      }
    }(this, this.#t.registry);
    const e = {
      ...t.find((a, r) => !r && _(a) === "Object") || {}
    }, i = t.find((a, r) => r && _(a) === "Object") || {}, { config: f = {}, detail: m = {}, name: n, owner: d } = i, { match: o } = f, u = t.filter((a, r) => r && typeof a == "function");
    this.#t.owner = d, this.#t.name = n, Object.assign(this.detail, { ...m }), this.config.match = o, this.update(e);
    for (const a of u)
      this.effects.add(a);
  }
  get $() {
    return this.#t.$;
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
    const s = this.keys().map((e) => [e, void 0]);
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
    const e = this.entries().filter(t);
    return this.update(e, { silent: s });
  }
  has(t) {
    return t in this.#t.current;
  }
  map(t, s = !1) {
    const e = this.entries().map(t);
    return this.update(e, { silent: s });
  }
  /* Tests if other contains the same non-undefined items as current.
  NOTE Does not participate in reactivity, but useful extra, especially for testing. */
  match(t) {
    if (t instanceof j)
      t = t.current;
    else if (_(t) === "Object")
      t = Object.fromEntries(
        Object.entries(t).filter(([s, e]) => e !== void 0)
      );
    else
      return !1;
    if (this.size !== Object.keys(t).length) return !1;
    for (const [s, e] of this.entries())
      if (!this.config.match(t[s], e)) return !1;
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
  update(t, { detail: s, silent: e = !1 } = {}) {
    Array.isArray(t) ? t = Object.fromEntries(t) : t instanceof j ? t = t.current : t = { ...t }, s && Object.assign(this.detail, { ...s });
    const i = {};
    for (const [n, d] of Object.entries(t))
      if (!this.config.match(d, this.#t.current[n])) {
        if (d === void 0) {
          n in this.#t.current && (i[n] = d, this.#t.previous[n] = this.#t.current[n], delete this.#t.current[n]);
          continue;
        }
        i[n] = d, this.#t.previous[n] = this.#t.current[n], this.#t.current[n] = d;
      }
    if (!Object.keys(i).length) return this;
    if (this.#t.change = Object.freeze(i), this.#t.session++, e) return this;
    if (!this.effects.size) return this;
    const f = b.create(this);
    let m = 0;
    for (const [n, d] of this.#t.registry.entries()) {
      f.detail = d, f.effect = n, f.index = m++;
      const { condition: o, once: u } = d;
      if ((!o || o(this.change, f)) && (n(this.change, f), u && this.effects.remove(n), f.stopped))
        break;
    }
    return this;
  }
};
const R = "$", I = R.length, P = (c) => class extends c {
  static __name__ = "reactive";
  #t = {};
  constructor() {
    super(), this.#t.state = N.create({ owner: this }), this.#t.state.effects.add(
      (t, s) => {
        this.update(t);
        const e = Object.fromEntries(
          Object.entries(t).filter(([i, f]) => !(i in this && !i.startsWith("_")) && !(i in this.style) && !i.startsWith("[") && !i.startsWith(".") && !i.startsWith("__") && !i.startsWith("@")).map(([i, f]) => [`state-${i}`, f])
        );
        this.attributes.update(e);
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
        Object.entries(t).filter(([s, e]) => s.startsWith(R)).map(([s, e]) => [s.slice(I), e])
      )
    ), this;
  }
}, { Mixins: T, author: k, component: q, factory: B, mix: C, mixins: D, registry: F } = await use(
  "@/component.js"
), G = k(
  class extends C(HTMLElement, {}, ...T(P)) {
  },
  "reactive-component"
), A = await use("Exception"), { typeName: J } = await use("@/tools/types.js"), K = (...c) => {
  const t = Reactive.create(...c);
  return new Proxy(() => {
  }, {
    get(s, e) {
      return A.if(!(e in t), `Invalid key: ${e}`), t[e];
    },
    set(s, e, i) {
      return A.if(!(e in t), `Invalid key: ${e}`), t[e] = i, !0;
    },
    apply(s, e, i) {
      return t.update(...i), t.current;
    }
  });
}, { typeName: E } = await use("@/tools/types.js");
class x {
  static create = (...t) => new x(...t);
  #t = {
    detail: {},
    registry: /* @__PURE__ */ new Map(),
    session: null
  };
  constructor(...t) {
    this.#t.effects = new class {
      #e = {};
      constructor(u, a) {
        this.#e.owner = u, this.#e.registry = a;
      }
      get size() {
        return this.#e.registry.size;
      }
      add(u, ...a) {
        const r = a.find((g) => typeof g == "function"), { data: l = {}, once: y, run: z = !0 } = a.find((g, O) => !O && E(g) === "Object") || {}, w = (() => {
          const g = { data: { ...l } };
          return r && (g.condition = r), y && (g.once = y), g;
        })();
        if (this.#e.registry.set(u, w), z) {
          const g = b.create(this.#e.owner);
          g.detail = w, g.effect = u, (!r || r(this.#e.owner.current, g)) && u(this.#e.owner.current, g);
        }
        return u;
      }
      clear() {
        this.#e.registry.clear();
      }
      has(u) {
        return this.#e.registry.has(u);
      }
      remove(u) {
        this.#e.registry.delete(u);
      }
    }(this, this.#t.registry);
    const s = t.find((o, u) => !u && E(o) !== "Object"), e = t.find((o) => E(o) === "Object") || {}, { detail: i = {}, match: f = function(o) {
      return this.current === o;
    }, name: m, owner: n } = e, d = t.filter((o, u) => u && typeof o == "function");
    this.match = f, this.#t.name = m, this.#t.owner = n, Object.assign(this.detail, i), this.update(s);
    for (const o of d)
      this.effects.add(o);
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
  update(t, { detail: s, silent: e = !1 } = {}) {
    if (s && Object.assign(this.detail, s), t === void 0) return this;
    if (this.match(t)) return this;
    if (this.#t.previous = this.#t.current, this.#t.current = t, this.#t.session++, e) return this;
    if (!this.effects.size) return this;
    const i = b.create(this);
    let f = 0;
    for (const [m, n] of this.#t.registry.entries()) {
      i.detail = n, i.effect = m, i.index = f++;
      const { condition: d, once: o } = n;
      if ((!d || d(this.current, i)) && (m(this.current, i), o && this.effects.remove(m), i.stopped))
        break;
    }
    return this;
  }
}
const { author: H, mix: L, mixins: h } = await use("@/component.js"), V = H(
  class extends L(
    HTMLElement,
    {},
    h.append,
    h.attrs,
    h.classes,
    h.clear,
    h.connect,
    h.detail,
    h.find,
    h.handlers,
    h.insert,
    h.parent,
    h.props,
    h.send,
    h.style,
    h.text,
    h.uid,
    h.vars
  ) {
    #t = {};
    constructor() {
      super(), this.#t.ref = x.create({ owner: this }), this.#t.ref.effects.add(
        (c, t) => {
          this.attribute.current = c, this.attribute.previous = this.previous, this.attribute.session = this.session, this.send("change", { detail: Object.freeze({ current: c, message: t }) });
        },
        { run: !1 }
      );
    }
    get current() {
      return this.#t.ref.current;
    }
    set current(c) {
      this.#t.ref.update(c);
    }
    get effects() {
      return this.#t.ref.effects;
    }
    get name() {
      return this.attribute.name;
    }
    set name(c) {
      this.attribute.name = c;
    }
    get owner() {
      return this.#t.owner;
    }
    set owner(c) {
      c && (this.attribute.owner = c.uid ? c.uid : !0), this.#t.owner = c;
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
  },
  "ref-component"
), M = await use("Exception"), X = (...c) => {
  const t = x.create(...c);
  return new Proxy(() => {
  }, {
    get(s, e) {
      return M.if(!(e in t), `Invalid key: ${e}`), t[e];
    },
    set(s, e, i) {
      return M.if(!(e in t), `Invalid key: ${e}`), t[e] = i, !0;
    },
    apply(s, e, i) {
      return t.update(...i), t.current;
    }
  });
}, Y = (c) => class extends c {
  static __name__ = "ref";
  #t = {};
  constructor() {
    super(), this.#t.ref = x.create({ owner: this }), this.#t.ref.effects.add(
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
  N as Reactive,
  G as ReactiveComponent,
  x as Ref,
  V as RefComponent,
  K as reactive,
  X as ref,
  Y as refMixin,
  P as stateMixin
};

const { type: j } = await use("@/tools/type");
class w {
  #t = {};
  constructor(s) {
    this.#t.args = s;
  }
  /* Returns children. */
  get children() {
    return this.#t.children === void 0 && (this.#t.children = this.#t.args.filter((s) => s instanceof HTMLElement)), this.#t.children;
  }
  /* Returns CSS classes */
  get classes() {
    return this.#t.classes === void 0 && (this.#t.classes = this.#t.args.find(
      (s, t) => !t && typeof s == "string"
    ), this.#t.classes && (this.#t.classes = this.#t.classes.split(" ").map((s) => s.trim()).filter((s) => !!s).join("."))), this.#t.classes;
  }
  /* Returns hooks. */
  get hooks() {
    return this.#t.hooks === void 0 && (this.#t.hooks = this.#t.args.filter((s) => typeof s == "function"), this.#t.hooks.length || (this.#t.hooks = null)), this.#t.hooks;
  }
  /* Returns text. */
  get text() {
    return this.#t.text === void 0 && (this.#t.text = this.#t.args.find((s, t) => t && typeof s == "string")), this.#t.text;
  }
  /* Returns updates. */
  get updates() {
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((s, t) => j(s) === "Object") || {}), this.#t.updates;
  }
}
const y = (i) => (...s) => {
  s = new w(s);
  const t = typeof i == "function" ? new i(s) : i;
  if (t.constructor.__new__?.call(t, s), t.__new__?.(s), t.classes && t.classes.add(s.classes), t.update?.(s.updates), s.text && t.insertAdjacentText("afterbegin", s.text), t.append?.(...s.children), t.__init__?.(s), t.constructor.__init__?.call(t, s), s.hooks) {
    const e = [];
    s.hooks.forEach((n) => {
      const r = n.call(t, t);
      typeof r == "function" && e.push(r);
    }), e.length && setTimeout(() => {
      e.forEach((n) => n.call(t, t));
    }, 0);
  }
  return t;
}, E = (i, s, ...t) => {
  let e = i;
  for (const n of t)
    e = n(e, s, ...t);
  return e;
}, A = (i, s) => class extends i {
  static __name__ = "append";
  /* Appends children. Chainable. */
  append(...t) {
    return super.append(...t), this;
  }
  /* Prepends children. Chainable. */
  prepend(...t) {
    return super.prepend(...t), this;
  }
}, { camelToKebab: b } = await use("@/tools/case"), L = (i, s) => class extends i {
  static __name__ = "attrs";
  #t = {};
  constructor() {
    super();
    const t = this, e = super.attributes;
    this.#t.attributes = new class {
      /* Returns attributes NamedNodeMap (for advanced use). */
      get attributes() {
        return e;
      }
      get owner() {
        return t;
      }
      /* Returns number of set attributes. */
      get size() {
        return e.length;
      }
      /* Returns attribute entries. */
      entries() {
        return Array.from(e, (r) => [
          r.name,
          this.#e(r.value)
        ]);
      }
      /* Returns attribute value. */
      get(r) {
        if (r = b(r), !t.hasAttribute(r))
          return null;
        const o = t.getAttribute(r);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(r) {
        return r = b(r), t.hasAttribute(r);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(e, (r) => r.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(r, o) {
        if (r = b(r), o === void 0 || o === "...")
          return t;
        const c = this.#e(t.getAttribute(r));
        return o === c || ([!1, null].includes(o) ? t.removeAttribute(r) : o === !0 || !["number", "string"].includes(typeof o) ? t.setAttribute(r, "") : t.setAttribute(r, o), t.dispatchEvent(
          new CustomEvent("_attributes", {
            detail: Object.freeze({ name: r, current: o, previous: c })
          })
        )), t;
      }
      /* Updates one or more attribute values. Chainable with respect to component. */
      update(r = {}) {
        return Object.entries(r).forEach(([o, c]) => {
          this.set(o, c);
        }), t;
      }
      /* Returns attribute values (interpreted). */
      values() {
        return Array.from(e, (r) => r.value);
      }
      #e(r) {
        if (r === "")
          return !0;
        if (r === null)
          return r;
        const o = Number(r);
        return isNaN(o) ? r || !0 : o;
      }
    }(), this.#t.attribute = new Proxy(this, {
      get(n, r) {
        return n.attributes.get(r);
      },
      set(n, r, o) {
        return n.attributes.set(r, o), !0;
      }
    });
  }
  attributeChangedCallback(t, e, n) {
    super.attributeChangedCallback?.(t, e, n), this.dispatchEvent(
      new CustomEvent("_attribute", { detail: Object.freeze({ name: t, previous: e, current: n }) })
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
  update(t = {}) {
    return super.update?.(t), this.attributes.update(
      Object.fromEntries(
        Object.entries(t).filter(([e, n]) => e.startsWith("[") && e.endsWith("]")).map(([e, n]) => [e.slice(1, -1), n])
      )
    ), this;
  }
}, O = (i, s) => class extends i {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const t = this;
    this.#t.classes = new class {
      /* Returns classList (for advanced use). */
      get list() {
        return t.classList;
      }
      /* Adds classes. */
      add(...e) {
        for (const n of e)
          n && (n.includes(" ") ? t.classList.add(
            ...n.split(" ").map((r) => r.trim()).filter((r) => !!r)
          ) : t.classList.add(...n.split(".")));
        return t;
      }
      /* Removes all classes. */
      clear() {
        for (const e of Array.from(t.classList))
          t.classList.remove(e);
        return t;
      }
      /* Checks, if classes are present. */
      has(e) {
        for (const n of e.split("."))
          if (!t.classList.contains(n))
            return !1;
        return !0;
      }
      /* Adds/removes classes according to condition. */
      if(e, n) {
        return this[e ? "add" : "remove"](n), t;
      }
      /* Removes classes. */
      remove(e) {
        return e && t.classList.remove(...e.split(".")), t;
      }
      /* Replaces classes with substitutes. 
      NOTE
      - If mismatch between 'classes' and 'substitutes' sizes are (intentionally) 
      silently ignored. */
      replace(e, n) {
        e = e.split("."), n = n.split(".");
        for (let r = 0; r < e.length; r++) {
          const o = n.at(r);
          if (o === void 0)
            break;
          t.classList.replace(e[r], o);
        }
        return t;
      }
      /* Toggles classes. */
      toggle(e, n) {
        for (const r of e.split("."))
          t.classList.toggle(r, n);
        return t;
      }
    }();
  }
  /* Returns controller for managing CSS classes from '.'-separated strings. */
  get classes() {
    return this.#t.classes;
  }
  /* Updates CSS classes from '.'-syntax. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (const [e, n] of Object.entries(t))
      e.startsWith(".") && (n === void 0 || n === "..." || this.classes[n ? "add" : "remove"](e.slice(1)));
    return this;
  }
}, C = (i, s) => class extends i {
  static __name__ = "clear";
  /* Clears content, optionally subject to selector. Chainable. */
  clear(t) {
    if (t)
      for (const e of Array.from(this.children))
        e.matches(t) && e.remove();
    else {
      for (; this.firstElementChild; )
        this.firstElementChild.remove();
      this.innerHTML = "";
    }
    return this;
  }
}, P = (i, s) => class extends i {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, T = 5, $ = (i, s) => class extends i {
  static __name__ = "data";
  #t = {};
  constructor() {
    super(), this.#t.data = new Proxy(this, {
      get(t, e) {
        return t.attributes.get(`data-${e}`);
      },
      set(t, e, n) {
        return t.attributes.set(`data-${e}`, n), !0;
      }
    });
  }
  /* Provides access to single data attribute without use of strings. */
  get data() {
    return this.#t.data;
  }
  /* Updates attributes from 'data.'-syntax. */
  update(t = {}) {
    return super.update?.(t), this.attributes.update(
      Object.fromEntries(
        Object.entries(t).filter(([e, n]) => e.startsWith("data.")).map(([e, n]) => [`data-${e.slice(T)}`, n])
      )
    ), this;
  }
}, k = (i, s) => class extends i {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, W = (i, s) => class extends i {
  static __name__ = "find";
  /* Unified alternative to 'querySelector' and 'querySelectorAll' 
  with a leaner syntax. */
  find(t) {
    const e = this.querySelectorAll(t);
    return e.length === 1 ? e[0] : e.length ? e.values() : null;
  }
  search(t) {
    const e = this.querySelectorAll(t) || null;
    if (e)
      return e.values();
  }
}, S = (i, s) => class extends i {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(t) {
    t ? this.setAttribute("for", t) : this.removeAttribute("for");
  }
}, { type: m } = await use("@/tools/type"), M = 3;
let z = class x {
  static create = (...s) => new x(...s);
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(s, t) {
    if (this.#t.registry.has(s))
      this.#t.registry.get(s).add(t);
    else {
      const e = /* @__PURE__ */ new Set();
      e.add(t), this.#t.registry.set(s, e);
    }
  }
  values(s) {
    return this.#t.registry.has(s) ? Array.from(this.#t.registry.get(s).values()) : [];
  }
  has(s, t) {
    return this.#t.registry.has(s) ? this.#t.registry.get(s).has(t) : !1;
  }
  remove(s, t) {
    this.#t.registry.has(s) && this.#t.registry.get(s).delete(t);
  }
  size(s) {
    return this.#t.registry.has(s) ? this.#t.registry.get(s).size : 0;
  }
};
const H = (i, s) => class extends i {
  static __name__ = "handlers";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.handlers = z.create(), this.#t.on = new Proxy(() => {
    }, {
      /* "point-of-truth" event registration */
      get(n, r) {
        return (...o) => {
          const { once: c, run: u } = o.find((_) => m(_) === "Object") || {}, a = o.find((_) => m(_) !== "Object");
          return e.addEventListener(r, a, { once: c }), u && a({}), a;
        };
      },
      set(n, r, o) {
        const c = r.split("."), u = c.at(0);
        return e.on[u](
          { once: c.includes("once"), run: c.includes("run") },
          o
        ), !0;
      },
      apply(n, r, o) {
        const c = o.shift();
        return e.on[c](...o);
      }
    });
  }
  /* Adds event handler with the special on-syntax.
  Examples:
  button.on.click({ once: true }, handler);
  button.on["click.once"] = handler;
  button.on("click", { once: true }, handler);
  */
  get on() {
    return this.#t.on;
  }
  addEventListener(e, n, ...r) {
    return super.addEventListener(e, n, ...r), this;
  }
  removeEventListener(e, n, ...r) {
    return super.removeEventListener(e, n, ...r), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(e = {}) {
    super.update?.(e);
    for (const [n, r] of Object.entries(e))
      if (n.startsWith("on.")) {
        const o = n.slice(M);
        this.on[o] = r;
      }
    return this;
  }
}, N = (i, s) => class extends i {
  static __name__ = "hook";
  hook(t) {
    return t ? t.call(this) ?? this : this;
  }
};
class R {
  #t = {};
  constructor(s) {
    this.#t.owner = s;
  }
  /* Inserts elements/html fragments 'afterbegin'. Chainable with respect to component. */
  afterbegin(...s) {
    return s.reverse().forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterbegin", t);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'afterend'. Chainable with respect to component. */
  afterend(...s) {
    return s.reverse().forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterend", t);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'beforebegin'. Chainable with respect to component. */
  beforebegin(...s) {
    return s.forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforebegin", t);
    }), this.#t.owner;
  }
  /* Inserts  elements/html fragments 'beforeend'. Chainable with respect to component. */
  beforeend(...s) {
    return s.forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforeend", t);
    }), this.#t.owner;
  }
}
const q = (i, s, ...t) => class extends i {
  static __name__ = "insert";
  #t = {};
  __new__() {
    super.__new__?.(), this.#t.insert = new R(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, V = (i, s) => class extends i {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(t) {
    t ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
}, { type: f } = await use("@/tools/type"), { TaggedSets: D } = await use("@/tools/stores"), F = 3;
class I {
  #t = {};
  constructor(s) {
    this.#t.registry = D.create(), this.#t.owner = s;
  }
  add(s, t) {
    this.#t.registry.has(s, t) || this.#t.registry.add(s, t);
  }
  clear(s) {
    const t = this.#t.registry.values(s);
    if (t) {
      for (const e of t)
        this.#t.owner.removeEventListener(s, e);
      this.#t.registry.clear(s);
    }
  }
  has(s, t) {
    return this.#t.registry.has(s, t);
  }
  remove(s, t) {
    this.#t.registry.has(s, t) && this.#t.registry.remove(s, t);
  }
  size(s) {
    return this.#t.registry.size(s);
  }
}
const K = (i, s) => class extends i {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const e = this, n = new I(this);
    this.#t.registry = n, this.#t.on = new Proxy(() => {
    }, {
      get(r, o) {
        if (o === "registry")
          return n;
        const c = o;
        return new Proxy(() => {
        }, {
          get(u, a) {
            return (..._) => {
              const h = _.find((l) => typeof l == "function"), g = _.find((l) => f(l) === "Object") || {};
              return e[a === "use" ? "addEventListener" : "removeEventListener"](c, h, g);
            };
          },
          apply(u, a, _) {
            const h = _.find((l) => typeof l == "function"), g = _.find((l) => f(l) === "Object") || {};
            return e.addEventListener(c, h, g);
          }
        });
      },
      set(r, o, c) {
        const [u, ...a] = o.split(".");
        return e.addEventListener(
          u,
          c,
          Object.fromEntries(a.map((_) => [_, !0]))
        ), !0;
      },
      apply(r, o, c) {
        return e.addEventListener(...c);
      }
    });
  }
  /* Adds event handler with the special on-syntax.
  Examples:
  button.on.click.use({ once: true }, handler);
  button.on["click.once"] = handler;
  button.on("click", { once: true }, handler);
  */
  get on() {
    return this.#t.on;
  }
  /* "point-of-truth" event handler registration */
  addEventListener(...e) {
    const [n, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], {
      once: o = !1,
      run: c = !1,
      track: u = !1,
      ...a
    } = e.find((_, h) => h && f(_) === "Object") || {};
    return u && !o && this.#t.registry.add(n, r), super.addEventListener(n, r, { once: o, ...a }), c && r(), {
      self: this,
      handler: r,
      once: o,
      remove: () => {
        this.removeEventListener(n, r, { track: u });
      },
      track: u,
      type: n,
      ...a
    };
  }
  /* "point-of-truth" event handler deregistration */
  removeEventListener(...e) {
    const [n, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], { track: o = !1, ...c } = e.find((u, a) => a && f(u) === "Object") || {};
    return o && this.#t.registry.remove(n, r), super.removeEventListener(n, r, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(e = {}) {
    super.update?.(e);
    for (const [n, r] of Object.entries(e))
      if (n.startsWith("on.")) {
        const o = n.slice(F), [c, ...u] = o.split("."), a = Object.fromEntries(u.map((_) => [_, !0]));
        console.log("options:", a), this.addEventListener(c, r, a);
      }
    return this;
  }
}, U = (i, s) => class extends i {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    this.#t.owner = t, this.attribute && (this.attribute = t && "uid" in t ? t.uid : t);
  }
}, B = (i, s) => class extends i {
  static __name__ = "parent";
  #t = {};
  /* Returns parent. */
  get parent() {
    return this.parentElement;
  }
  /* Appends component to parent or removes component. */
  set parent(t) {
    t !== void 0 && t !== this.parentElement && (t === null ? this.remove() : t.append(this));
  }
  get __parent__() {
    return this.#t.parent;
  }
  set __parent__(t) {
    this.#t.parent = t;
  }
  update(t = {}) {
    return super.update?.(t), t.__parent__ && (this.__parent__ = t.__parent__), this;
  }
  __init__() {
    super.__init__?.(), this.__parent__ && (this.parent = this.__parent__);
  }
}, G = (i, s) => class extends i {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (const [e, n] of Object.entries(t))
      e.startsWith("__") || !(e in this) && !e.startsWith("_") || n === void 0 || n === "..." || this[e] !== n && (typeof n == "function" ? n((r) => this[e] = r) : this[e] = n);
    return this;
  }
}, J = (i, s) => class extends i {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(t, { detail: e, trickle: n, ...r } = {}) {
    const o = e === void 0 ? new Event(t, r) : new CustomEvent(t, { detail: e, ...r });
    if (this.dispatchEvent(o), n) {
      const c = typeof n == "string" ? this.querySelectorAll(n) : this.children;
      for (const u of c)
        u.dispatchEvent(o);
    }
    return o;
  }
}, Q = (i, s) => class extends i {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [e, n] of Object.entries(t))
      e in this || e in this.style && (n === void 0 || n === "..." || (n === null ? n = "none" : n === 0 && (n = "0"), this.style[e] !== n && (this.style[e] = n)));
    return this;
  }
}, X = (i, s, ...t) => class extends i {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const e = (r) => super[r], n = (r, o) => {
      super[r] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(r, o) {
        return e(o);
      },
      set(r, o, c) {
        return n(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, Y = (i, s) => class extends i {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(t) {
    [!1, null].includes(t) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", t);
  }
}, Z = (i, s) => class extends i {
  static __name__ = "text";
  /* Returns text content. */
  get text() {
    return this.textContent || null;
  }
  /* Sets text content. */
  set text(t) {
    this.textContent = t;
  }
};
let tt = 0;
const et = (i, s) => class extends i {
  static __name__ = "uid";
  constructor() {
    super(), this.setAttribute("uid", `uid${tt++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, st = (i, s) => class extends i {
  static __name__ = "vars";
  #t = {};
  constructor() {
    super(), this.#t.__ = new Proxy(this, {
      get(t, e) {
        if (e.startsWith("--") || (e = `--${e}`), t.isConnected) {
          const o = getComputedStyle(t).getPropertyValue(e).trim();
          if (!o) return !1;
          const c = t.style.getPropertyPriority(e);
          return c ? `${o} !${c}` : o === "none" ? null : o;
        }
        const n = t.style.getPropertyValue(e);
        if (!n) return !1;
        const r = t.style.getPropertyPriority(e);
        return r ? `${n} !${r}` : n === "none" ? null : n;
      },
      set(t, e, n) {
        if (e.startsWith("--") || (e = `--${e}`), n === null ? n = "none" : n === 0 && (n = "0"), n === void 0 || n === "...")
          return !0;
        const r = t.__[e];
        return n === r || (n === !1 ? t.style.removeProperty(e) : typeof n == "string" ? (n = n.trim(), n.endsWith("!important") ? t.style.setProperty(
          e,
          n.slice(0, -10),
          "important"
        ) : t.style.setProperty(e, n)) : t.style.setProperty(e, n)), !0;
      }
    });
  }
  /* Provides access to single CSS var without use of strings. */
  get __() {
    return this.#t.__;
  }
  /* Updates CSS vars from '__'-syntax. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [e, n] of Object.entries(t))
      e.endsWith("__") || e.startsWith("__") && (this.__[e.slice(2)] = n);
    return this;
  }
}, nt = 9, rt = -3, d = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": A,
        "./mixins/attrs.js": L,
        "./mixins/classes.js": O,
        "./mixins/clear.js": C,
        "./mixins/connect.js": P,
        "./mixins/data.js": $,
        "./mixins/detail.js": k,
        "./mixins/find.js": W,
        "./mixins/for_.js": S,
        "./mixins/handlers copy.js": H,
        "./mixins/hook.js": N,
        "./mixins/insert.js": q,
        "./mixins/novalidation.js": V,
        "./mixins/on.js": K,
        "./mixins/owner.js": U,
        "./mixins/parent.js": B,
        "./mixins/props.js": G,
        "./mixins/send.js": J,
        "./mixins/style.js": Q,
        "./mixins/super_.js": X,
        "./mixins/tab.js": Y,
        "./mixins/text.js": Z,
        "./mixins/uid.js": et,
        "./mixins/vars.js": st
      })
    ).map(([i, s]) => [i.slice(nt, rt), s])
  )
), it = (...i) => {
  const s = i.filter(
    (r) => typeof r == "string" && !r.startsWith("!")
  ), t = i.filter((r) => typeof r == "string" && r.startsWith("!")).map((r) => r.slice(1)), e = i.filter((r) => typeof r == "function");
  t.push("for_", "novalidation");
  const n = Object.entries(d).filter(([r, o]) => s.includes(r) ? !0 : !t.includes(r)).map(([r, o]) => o);
  return n.push(...e), n;
}, p = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(i, s, t) {
    s ? Object.defineProperty(i, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: s
    }) : s = i.__key__, t ? Object.defineProperty(i, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = i.__native__;
    const e = [s, i];
    return t && e.push({ extends: t }), customElements.define(...e), use.meta.DEV, this.#t.registry.set(s, i), i;
  }
  get(i) {
    return this.#t.registry.get(i);
  }
  has(i) {
    return this.#t.registry.has(i);
  }
  values() {
    return this.#t.registry.values();
  }
}(), { stateMixin: ot } = await use("@/state"), ct = (i) => {
  const s = `x-${i}`;
  if (p.has(s))
    return p.get(s);
  const t = document.createElement(i), e = t.constructor;
  if (e === HTMLUnknownElement)
    throw new Error(`'${i}' is not native.`);
  const n = it("!text", ot);
  return "textContent" in t && n.push(d.text), i === "form" && n.push(d.novalidation), i === "label" && n.push(d.for_), p.add(
    class extends E(e, {}, ...n) {
      static __key__ = s;
      static __native__ = i;
      constructor() {
        super(), this.setAttribute("web-component", "");
      }
    }
  );
}, v = (i) => {
  const s = ct(i), t = new s();
  return y(t);
}, lt = (i, ...s) => {
  const [t, ...e] = i.split("."), n = v(t);
  return e.length ? n(`${e.join(".")}`, ...s) : n(...s);
}, ht = new Proxy(
  {},
  {
    get(i, s) {
      return v(s);
    }
  }
), ft = (i, s, t) => y(p.add(i, s, t));
export {
  lt as Component,
  v as Factory,
  it as Mixins,
  ft as author,
  ht as component,
  y as factory,
  E as mix,
  d as mixins,
  p as registry
};

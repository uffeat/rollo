const { type: x } = await use("@/tools/type");
class v {
  #t = {};
  constructor(n) {
    this.#t.args = n;
  }
  /* Returns children. */
  get children() {
    return this.#t.children === void 0 && (this.#t.children = this.#t.args.filter((n) => n instanceof HTMLElement)), this.#t.children;
  }
  /* Returns CSS classes */
  get classes() {
    return this.#t.classes === void 0 && (this.#t.classes = this.#t.args.find(
      (n, t) => !t && typeof n == "string"
    ), this.#t.classes && (this.#t.classes = this.#t.classes.split(" ").map((n) => n.trim()).filter((n) => !!n).join("."))), this.#t.classes;
  }
  /* Returns hooks. */
  get hooks() {
    return this.#t.hooks === void 0 && (this.#t.hooks = this.#t.args.filter((n) => typeof n == "function"), this.#t.hooks.length || (this.#t.hooks = null)), this.#t.hooks;
  }
  /* Returns text. */
  get text() {
    return this.#t.text === void 0 && (this.#t.text = this.#t.args.find((n, t) => t && typeof n == "string")), this.#t.text;
  }
  /* Returns updates. */
  get updates() {
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((n, t) => x(n) === "Object") || {}), this.#t.updates;
  }
}
const m = (i) => (...n) => {
  n = new v(n);
  const t = typeof i == "function" ? new i(n) : i;
  if (t.constructor.__new__?.call(t, n), t.__new__?.(n), t.classes && t.classes.add(n.classes), t.update?.(n.updates), n.text && t.insertAdjacentText("afterbegin", n.text), t.append?.(...n.children), t.__init__?.(n), t.constructor.__init__?.call(t, n), n.hooks) {
    const e = [];
    n.hooks.forEach((s) => {
      const r = s.call(t, t);
      typeof r == "function" && e.push(r);
    }), e.length && setTimeout(() => {
      e.forEach((s) => s.call(t, t));
    }, 0);
  }
  return t;
}, j = (i, n, ...t) => {
  let e = i;
  for (const s of t)
    e = s(e, n, ...t);
  return e;
}, w = (i, n) => class extends i {
  static __name__ = "append";
  /* Appends children. Chainable. */
  append(...t) {
    return super.append(...t), this;
  }
  /* Prepends children. Chainable. */
  prepend(...t) {
    return super.prepend(...t), this;
  }
}, { camelToKebab: b } = await use("@/tools/case"), E = (i, n) => class extends i {
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
      get(s, r) {
        return s.attributes.get(r);
      },
      set(s, r, o) {
        return s.attributes.set(r, o), !0;
      }
    });
  }
  attributeChangedCallback(t, e, s) {
    super.attributeChangedCallback?.(t, e, s), this.dispatchEvent(
      new CustomEvent("_attribute", { detail: Object.freeze({ name: t, previous: e, current: s }) })
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
        Object.entries(t).filter(([e, s]) => e.startsWith("[") && e.endsWith("]")).map(([e, s]) => [e.slice(1, -1), s])
      )
    ), this;
  }
}, A = (i, n) => class extends i {
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
        for (const s of e)
          s && (s.includes(" ") ? t.classList.add(
            ...s.split(" ").map((r) => r.trim()).filter((r) => !!r)
          ) : t.classList.add(...s.split(".")));
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
        for (const s of e.split("."))
          if (!t.classList.contains(s))
            return !1;
        return !0;
      }
      /* Adds/removes classes according to condition. */
      if(e, s) {
        return this[e ? "add" : "remove"](s), t;
      }
      /* Removes classes. */
      remove(e) {
        return e && t.classList.remove(...e.split(".")), t;
      }
      /* Replaces classes with substitutes. 
      NOTE
      - If mismatch between 'classes' and 'substitutes' sizes are (intentionally) 
      silently ignored. */
      replace(e, s) {
        e = e.split("."), s = s.split(".");
        for (let r = 0; r < e.length; r++) {
          const o = s.at(r);
          if (o === void 0)
            break;
          t.classList.replace(e[r], o);
        }
        return t;
      }
      /* Toggles classes. */
      toggle(e, s) {
        for (const r of e.split("."))
          t.classList.toggle(r, s);
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
    for (const [e, s] of Object.entries(t))
      e.startsWith(".") && (s === void 0 || s === "..." || this.classes[s ? "add" : "remove"](e.slice(1)));
    return this;
  }
}, O = (i, n) => class extends i {
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
}, L = (i, n) => class extends i {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, k = 5, C = (i, n) => class extends i {
  static __name__ = "data";
  #t = {};
  constructor() {
    super(), this.#t.data = new Proxy(this, {
      get(t, e) {
        return t.attributes.get(`data-${e}`);
      },
      set(t, e, s) {
        return t.attributes.set(`data-${e}`, s), !0;
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
        Object.entries(t).filter(([e, s]) => e.startsWith("data.")).map(([e, s]) => [`data-${e.slice(k)}`, s])
      )
    ), this;
  }
}, P = (i, n) => class extends i {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, T = (i, n) => class extends i {
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
}, $ = (i, n) => class extends i {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(t) {
    t ? this.setAttribute("for", t) : this.removeAttribute("for");
  }
}, W = (i, n) => class extends i {
  static __name__ = "hook";
  hook(t) {
    return t ? t.call(this) ?? this : this;
  }
};
class M {
  #t = {};
  constructor(n) {
    this.#t.owner = n;
  }
  /* Inserts elements/html fragments 'afterbegin'. Chainable with respect to component. */
  afterbegin(...n) {
    return n.reverse().forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterbegin", t);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'afterend'. Chainable with respect to component. */
  afterend(...n) {
    return n.reverse().forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("afterend", t);
    }), this.#t.owner;
  }
  /* Inserts elements/html fragments 'beforebegin'. Chainable with respect to component. */
  beforebegin(...n) {
    return n.forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforebegin", t);
    }), this.#t.owner;
  }
  /* Inserts  elements/html fragments 'beforeend'. Chainable with respect to component. */
  beforeend(...n) {
    return n.forEach((t) => {
      t && this.#t.owner[typeof t == "string" ? "insertAdjacentHTML" : "insertAdjacentElement"]("beforeend", t);
    }), this.#t.owner;
  }
}
const z = (i, n, ...t) => class extends i {
  static __name__ = "insert";
  #t = {};
  __new__() {
    super.__new__?.(), this.#t.insert = new M(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, S = (i, n) => class extends i {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(t) {
    t ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
}, { type: h } = await use("@/tools/type"), { TaggedSets: H } = await use("@/tools/stores"), N = 3;
class R {
  #t = {};
  constructor(n) {
    this.#t.registry = H.create(), this.#t.owner = n;
  }
  get types() {
    return this.#t.registry.tags;
  }
  add(n, t) {
    this.#t.registry.has(n, t) || this.#t.registry.add(n, t);
  }
  clear(n) {
    const t = this.#t.registry.values(n);
    if (t) {
      for (const e of t)
        this.#t.owner.removeEventListener(n, e);
      this.#t.registry.clear(n);
    }
  }
  has(n, t) {
    return this.#t.registry.has(n, t);
  }
  remove(n, t) {
    this.#t.registry.has(n, t) && this.#t.registry.remove(n, t);
  }
  size(n) {
    return this.#t.registry.size(n);
  }
}
const q = (i, n) => class extends i {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.registry = new R(this);
    const s = new class {
      get types() {
        return e.#t.registry.types;
      }
      clear(r) {
        return e.#t.registry.clear(r);
      }
      has(r, o) {
        return e.#t.registry.has(r, o);
      }
      size(r) {
        return e.#t.registry.size(r);
      }
    }();
    this.#t.on = new Proxy(() => {
    }, {
      get(r, o) {
        if (o === "registry")
          return s;
        const c = o;
        return new Proxy(() => {
        }, {
          get(u, _) {
            return (...a) => {
              const f = a.find((l) => typeof l == "function"), g = a.find((l) => h(l) === "Object") || {};
              return e[_ === "use" ? "addEventListener" : "removeEventListener"](c, f, g);
            };
          },
          apply(u, _, a) {
            const f = a.find((l) => typeof l == "function"), g = a.find((l) => h(l) === "Object") || {};
            return e.addEventListener(c, f, g);
          }
        });
      },
      set(r, o, c) {
        const [u, ..._] = o.split(".");
        return e.addEventListener(
          u,
          c,
          Object.fromEntries(_.map((a) => [a, !0]))
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
  /* Registers event handler.
  Overloads original 'addEventListener'. Does not break original API, but 
  handles additional options and returns an object that can be used for later 
  dereg or chaining.
  NOTE "point-of-truth" event handler registration. */
  addEventListener(...e) {
    const [s, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], {
      once: o = !1,
      run: c = !1,
      track: u = !1,
      ..._
    } = e.find((a, f) => f && h(a) === "Object") || {};
    return u && !o && this.#t.registry.add(s, r), super.addEventListener(s, r, { once: o, ..._ }), c && r(), {
      self: this,
      handler: r,
      once: o,
      remove: () => {
        this.removeEventListener(s, r, { track: u });
      },
      track: u,
      type: s,
      ..._
    };
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options and is chainable.
  NOTE "point-of-truth" event handler deregistration. */
  removeEventListener(...e) {
    const [s, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], { track: o = !1, ...c } = e.find((u, _) => _ && h(u) === "Object") || {};
    return o && this.#t.registry.remove(s, r), super.removeEventListener(s, r, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(e = {}) {
    super.update?.(e);
    for (const [s, r] of Object.entries(e))
      if (s.startsWith("on.")) {
        const [o, ...c] = s.slice(N).split("."), u = Object.fromEntries(c.map((_) => [_, !0]));
        this.addEventListener(o, r, u);
      }
    return this;
  }
}, V = (i, n) => class extends i {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    this.#t.owner = t, this.attribute && (this.attribute = t && "uid" in t ? t.uid : t);
  }
}, D = (i, n) => class extends i {
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
}, F = (i, n) => class extends i {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (const [e, s] of Object.entries(t))
      e.startsWith("__") || !(e in this) && !e.startsWith("_") || s === void 0 || s === "..." || this[e] !== s && (typeof s == "function" ? s((r) => this[e] = r) : this[e] = s);
    return this;
  }
}, I = (i, n) => class extends i {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(t, { detail: e, trickle: s, ...r } = {}) {
    const o = e === void 0 ? new Event(t, r) : new CustomEvent(t, { detail: e, ...r });
    if (this.dispatchEvent(o), s) {
      const c = typeof s == "string" ? this.querySelectorAll(s) : this.children;
      for (const u of c)
        u.dispatchEvent(o);
    }
    return o;
  }
}, K = (i, n) => class extends i {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [e, s] of Object.entries(t))
      e in this || e in this.style && (s === void 0 || s === "..." || (s === null ? s = "none" : s === 0 && (s = "0"), this.style[e] !== s && (this.style[e] = s)));
    return this;
  }
}, U = (i, n, ...t) => class extends i {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const e = (r) => super[r], s = (r, o) => {
      super[r] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(r, o) {
        return e(o);
      },
      set(r, o, c) {
        return s(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, B = (i, n) => class extends i {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(t) {
    [!1, null].includes(t) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", t);
  }
}, G = (i, n) => class extends i {
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
let J = 0;
const Q = (i, n) => class extends i {
  static __name__ = "uid";
  constructor() {
    super(), this.setAttribute("uid", `uid${J++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, X = (i, n) => class extends i {
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
        const s = t.style.getPropertyValue(e);
        if (!s) return !1;
        const r = t.style.getPropertyPriority(e);
        return r ? `${s} !${r}` : s === "none" ? null : s;
      },
      set(t, e, s) {
        if (e.startsWith("--") || (e = `--${e}`), s === null ? s = "none" : s === 0 && (s = "0"), s === void 0 || s === "...")
          return !0;
        const r = t.__[e];
        return s === r || (s === !1 ? t.style.removeProperty(e) : typeof s == "string" ? (s = s.trim(), s.endsWith("!important") ? t.style.setProperty(
          e,
          s.slice(0, -10),
          "important"
        ) : t.style.setProperty(e, s)) : t.style.setProperty(e, s)), !0;
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
    for (let [e, s] of Object.entries(t))
      e.endsWith("__") || e.startsWith("__") && (this.__[e.slice(2)] = s);
    return this;
  }
}, Y = 9, Z = -3, d = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": w,
        "./mixins/attrs.js": E,
        "./mixins/classes.js": A,
        "./mixins/clear.js": O,
        "./mixins/connect.js": L,
        "./mixins/data.js": C,
        "./mixins/detail.js": P,
        "./mixins/find.js": T,
        "./mixins/for_.js": $,
        "./mixins/hook.js": W,
        "./mixins/insert.js": z,
        "./mixins/novalidation.js": S,
        "./mixins/on.js": q,
        "./mixins/owner.js": V,
        "./mixins/parent.js": D,
        "./mixins/props.js": F,
        "./mixins/send.js": I,
        "./mixins/style.js": K,
        "./mixins/super_.js": U,
        "./mixins/tab.js": B,
        "./mixins/text.js": G,
        "./mixins/uid.js": Q,
        "./mixins/vars.js": X
      })
    ).map(([i, n]) => [i.slice(Y, Z), n])
  )
), tt = (...i) => {
  const n = i.filter(
    (r) => typeof r == "string" && !r.startsWith("!")
  ), t = i.filter((r) => typeof r == "string" && r.startsWith("!")).map((r) => r.slice(1)), e = i.filter((r) => typeof r == "function");
  t.push("for_", "novalidation");
  const s = Object.entries(d).filter(([r, o]) => n.includes(r) ? !0 : !t.includes(r)).map(([r, o]) => o);
  return s.push(...e), s;
}, p = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(i, n, t) {
    n ? Object.defineProperty(i, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: n
    }) : n = i.__key__, t ? Object.defineProperty(i, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = i.__native__;
    const e = [n, i];
    return t && e.push({ extends: t }), customElements.define(...e), use.meta.DEV, this.#t.registry.set(n, i), i;
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
}(), { stateMixin: et } = await use("@/state"), st = (i) => {
  const n = `x-${i}`;
  if (p.has(n))
    return p.get(n);
  const t = document.createElement(i), e = t.constructor;
  if (e === HTMLUnknownElement)
    throw new Error(`'${i}' is not native.`);
  const s = tt("!text", et);
  return "textContent" in t && s.push(d.text), i === "form" && s.push(d.novalidation), i === "label" && s.push(d.for_), p.add(
    class extends j(e, {}, ...s) {
      static __key__ = n;
      static __native__ = i;
      constructor() {
        super(), this.setAttribute("web-component", "");
      }
    }
  );
}, y = (i) => {
  const n = st(i), t = new n();
  return m(t);
}, it = (i, ...n) => {
  const [t, ...e] = i.split("."), s = y(t);
  return e.length ? s(`${e.join(".")}`, ...n) : s(...n);
}, ot = new Proxy(
  {},
  {
    get(i, n) {
      return y(n);
    }
  }
), ct = (i, n, t) => m(p.add(i, n, t));
export {
  it as Component,
  y as Factory,
  tt as Mixins,
  ct as author,
  ot as component,
  m as factory,
  j as mix,
  d as mixins,
  p as registry
};

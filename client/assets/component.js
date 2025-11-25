const { type: d } = await use("@/tools/type.js");
class p {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((n, t) => d(n) === "Object") || {}), this.#t.updates;
  }
}
const l = (r) => (...n) => {
  n = new p(n);
  const t = typeof r == "function" ? new r(n) : r;
  if (t.constructor.__new__?.call(t, n), t.__new__?.(n), t.classes && t.classes.add(n.classes), t.update?.(n.updates), n.text && t.insertAdjacentText("afterbegin", n.text), t.append?.(...n.children), t.__init__?.(n), t.constructor.__init__?.call(t, n), n.hooks) {
    const e = [];
    n.hooks.forEach((s) => {
      const i = s.call(t, t);
      typeof i == "function" && e.push(i);
    }), e.length && setTimeout(() => {
      e.forEach((s) => s.call(t, t));
    }, 0);
  }
  return t;
}, g = (r, n, ...t) => {
  let e = r;
  for (const s of t)
    e = s(e, n, ...t);
  return e;
}, b = (r, n) => class extends r {
  static __name__ = "append";
  /* Appends children. Chainable. */
  append(...t) {
    return super.append(...t), this;
  }
  /* Prepends children. Chainable. */
  prepend(...t) {
    return super.prepend(...t), this;
  }
}, { camelToKebab: a } = await use("@/tools/case.js"), m = (r, n) => class extends r {
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
        return Array.from(e, (i) => [
          i.name,
          this.#e(i.value)
        ]);
      }
      /* Returns attribute value. */
      get(i) {
        if (i = a(i), !t.hasAttribute(i))
          return null;
        const o = t.getAttribute(i);
        return this.#e(o);
      }
      /* Checks, if attribute set. */
      has(i) {
        return i = a(i), t.hasAttribute(i);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(e, (i) => i.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(i, o) {
        if (i = a(i), o === void 0 || o === "...")
          return t;
        const c = this.#e(t.getAttribute(i));
        return o === c || ([!1, null].includes(o) ? t.removeAttribute(i) : o === !0 || !["number", "string"].includes(typeof o) ? t.setAttribute(i, "") : t.setAttribute(i, o), t.dispatchEvent(
          new CustomEvent("_attributes", {
            detail: Object.freeze({ name: i, current: o, previous: c })
          })
        )), t;
      }
      /* Updates one or more attribute values. Chainable with respect to component. */
      update(i = {}) {
        return Object.entries(i).forEach(([o, c]) => {
          this.set(o, c);
        }), t;
      }
      /* Returns attribute values (interpreted). */
      values() {
        return Array.from(e, (i) => i.value);
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
      get(s, i) {
        return s.attributes.get(i);
      },
      set(s, i, o) {
        return s.attributes.set(i, o), !0;
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
}, x = (r, n) => class extends r {
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
            ...s.split(" ").map((i) => i.trim()).filter((i) => !!i)
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
        for (let i = 0; i < e.length; i++) {
          const o = s.at(i);
          if (o === void 0)
            break;
          t.classList.replace(e[i], o);
        }
        return t;
      }
      /* Toggles classes. */
      toggle(e, s) {
        for (const i of e.split("."))
          t.classList.toggle(i, s);
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
}, y = (r, n) => class extends r {
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
}, v = (r, n) => class extends r {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, j = 5, w = (r, n) => class extends r {
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
        Object.entries(t).filter(([e, s]) => e.startsWith("data.")).map(([e, s]) => [`data-${e.slice(j)}`, s])
      )
    ), this;
  }
}, E = (r, n) => class extends r {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, A = (r, n) => class extends r {
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
}, L = (r, n) => class extends r {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(t) {
    t ? this.setAttribute("for", t) : this.removeAttribute("for");
  }
};
class O {
  #t = {};
  constructor(n) {
    this.#t.owner = n, this.#t.on = new Proxy(this, {
      get(t, e) {
        throw new Error("'on' is write-only.");
      },
      set(t, e, s) {
        return t.add({ [e]: s }), !0;
      }
    });
  }
  /* Adds event handler with `on.type = handler`-syntax. */
  get on() {
    return this.#t.on;
  }
  add(n = {}) {
    const t = this.#t.owner;
    return Object.entries(n).forEach(([e, s]) => {
      const [i, ...o] = e.split("$");
      o.includes("once") ? t.addEventListener(i, s, { once: !0 }) : t.addEventListener(i, s), o.includes("run") && s({ target: t });
    }), t;
  }
  remove(n = {}) {
    return Object.entries(n).forEach(([t, e]) => {
      this.#t.owner.removeEventListener(t, e);
    }), this.#t.owner;
  }
}
const C = (r, n) => class extends r {
  static __name__ = "handlers";
  #t = {};
  constructor() {
    super(), this.#t.handlers = new O(this);
  }
  /* Returns controller for managing event handlers. */
  get handlers() {
    return this.#t.handlers;
  }
  /* Adds event handler with `on.type = handler`-syntax. */
  get on() {
    return this.#t.handlers.on;
  }
  addEventListener(t, e, s) {
    return super.addEventListener(t, e, s), k(e) ? e : this;
  }
  removeEventListener(t, e, ...s) {
    return super.removeEventListener(t, e, ...s), this;
  }
  /* Adds event handlers from '@'-syntax. Chainable. */
  update(t = {}) {
    return super.update?.(t), this.handlers.add(
      Object.fromEntries(
        Object.entries(t).filter(([e, s]) => e.startsWith("@")).map(([e, s]) => [e.slice(1), s])
      )
    ), this;
  }
};
function k(r) {
  return r.toString().includes("=>");
}
class P {
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
const $ = (r, n, ...t) => class extends r {
  static __name__ = "insert";
  #t = {};
  __new__() {
    super.__new__?.(), this.#t.insert = new P(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, T = (r, n) => class extends r {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(t) {
    t ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
}, W = (r, n) => class extends r {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    this.#t.owner = t, this.attribute && (this.attribute = t && "uid" in t ? t.uid : t);
  }
}, M = (r, n) => class extends r {
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
}, H = (r, n) => class extends r {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (const [e, s] of Object.entries(t))
      e.startsWith("__") || !(e in this) && !e.startsWith("_") || s === void 0 || s === "..." || this[e] !== s && (typeof s == "function" ? s((i) => this[e] = i) : this[e] = s);
    return this;
  }
}, S = (r, n) => class extends r {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(t, { detail: e, trickle: s, ...i } = {}) {
    const o = e === void 0 ? new Event(t, i) : new CustomEvent(t, { detail: e, ...i });
    if (this.dispatchEvent(o), s) {
      const c = typeof s == "string" ? this.querySelectorAll(s) : this.children;
      for (const h of c)
        h.dispatchEvent(o);
    }
    return o;
  }
}, z = (r, n) => class extends r {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [e, s] of Object.entries(t))
      e in this || e in this.style && (s === void 0 || s === "..." || (s === null ? s = "none" : s === 0 && (s = "0"), this.style[e] !== s && (this.style[e] = s)));
    return this;
  }
}, N = (r, n, ...t) => class extends r {
  static __name__ = "super_";
  #t = {};
  __new__() {
    super.__new__?.();
    const e = (i) => super[i], s = (i, o) => {
      super[i] = o;
    };
    this.#t.super_ = new Proxy(this, {
      get(i, o) {
        return e(o);
      },
      set(i, o, c) {
        return s(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t.super_;
  }
}, q = (r, n) => class extends r {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(t) {
    [!1, null].includes(t) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", t);
  }
}, V = (r, n) => class extends r {
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
let D = 0;
const R = (r, n) => class extends r {
  static __name__ = "uid";
  constructor() {
    super(), this.setAttribute("uid", `uid${D++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, F = (r, n) => class extends r {
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
        const i = t.style.getPropertyPriority(e);
        return i ? `${s} !${i}` : s === "none" ? null : s;
      },
      set(t, e, s) {
        if (e.startsWith("--") || (e = `--${e}`), s === null ? s = "none" : s === 0 && (s = "0"), s === void 0 || s === "...")
          return !0;
        const i = t.__[e];
        return s === i || (s === !1 ? t.style.removeProperty(e) : typeof s == "string" ? (s = s.trim(), s.endsWith("!important") ? t.style.setProperty(
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
}, I = 9, K = -3, u = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": b,
        "./mixins/attrs.js": m,
        "./mixins/classes.js": x,
        "./mixins/clear.js": y,
        "./mixins/connect.js": v,
        "./mixins/data.js": w,
        "./mixins/detail.js": E,
        "./mixins/find.js": A,
        "./mixins/for_.js": L,
        "./mixins/handlers.js": C,
        "./mixins/insert.js": $,
        "./mixins/novalidation.js": T,
        "./mixins/owner.js": W,
        "./mixins/parent.js": M,
        "./mixins/props.js": H,
        "./mixins/send.js": S,
        "./mixins/style.js": z,
        "./mixins/super_.js": N,
        "./mixins/tab.js": q,
        "./mixins/text.js": V,
        "./mixins/uid.js": R,
        "./mixins/vars.js": F
      })
    ).map(([r, n]) => [r.slice(I, K), n])
  )
), U = (...r) => {
  const n = r.filter(
    (i) => typeof i == "string" && !i.startsWith("!")
  ), t = r.filter((i) => typeof i == "string" && i.startsWith("!")).map((i) => i.slice(1)), e = r.filter((i) => typeof i == "function");
  t.push("for_", "novalidation");
  const s = Object.entries(u).filter(([i, o]) => n.includes(i) ? !0 : !t.includes(i)).map(([i, o]) => o);
  return s.push(...e), s;
}, _ = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(r, n, t) {
    n ? Object.defineProperty(r, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: n
    }) : n = r.__key__, t ? Object.defineProperty(r, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = r.__native__;
    const e = [n, r];
    return t && e.push({ extends: t }), customElements.define(...e), use.meta.DEV, this.#t.registry.set(n, r), r;
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
}(), { stateMixin: B } = await use("@/state.js"), G = (r) => {
  const n = `x-${r}`;
  if (_.has(n))
    return _.get(n);
  const t = document.createElement(r), e = t.constructor;
  if (e === HTMLUnknownElement)
    throw new Error(`'${r}' is not native.`);
  const s = U("!text", B);
  return "textContent" in t && s.push(u.text), r === "form" && s.push(u.novalidation), r === "label" && s.push(u.for_), _.add(
    class extends g(e, {}, ...s) {
      static __key__ = n;
      static __native__ = r;
      constructor() {
        super(), this.setAttribute("web-component", "");
      }
    }
  );
}, f = (r) => {
  const n = G(r), t = new n();
  return l(t);
}, Q = (r, ...n) => {
  const [t, ...e] = r.split("."), s = f(t);
  return e.length ? s(`${e.join(".")}`, ...n) : s(...n);
}, X = new Proxy(
  {},
  {
    get(r, n) {
      return f(n);
    }
  }
), Y = (r, n, t) => l(_.add(r, n, t));
export {
  Q as Component,
  f as Factory,
  U as Mixins,
  Y as author,
  X as component,
  l as factory,
  g as mix,
  u as mixins,
  _ as registry
};

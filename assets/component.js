const g = (r) => Object.prototype.toString.call(r).slice(8, -1);
class b {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((s, t) => g(s) === "Object") || {}), this.#t.updates;
  }
}
const f = (r) => (...s) => {
  s = new b(s);
  const t = typeof r == "function" ? new r(s) : r;
  if (t.constructor.__new__?.call(t, s), t.__new__?.(s), t.classes && t.classes.add(s.classes), t.update?.(s.updates), s.text && t.insertAdjacentText("afterbegin", s.text), t.append?.(...s.children), t.__init__?.(s), t.constructor.__init__?.call(t, s), s.hooks) {
    const n = [];
    s.hooks.forEach((e) => {
      const i = e.call(t, t);
      typeof i == "function" && n.push(i);
    }), n.length && setTimeout(() => {
      n.forEach((e) => e.call(t, t));
    }, 0);
  }
  return t;
}, _ = (r, s, ...t) => {
  let n = r;
  for (const e of t)
    n = e(n, s, ...t);
  return n;
}, m = (r, s) => class extends r {
  static __name__ = "append";
  /* Appends children. Chainable. */
  append(...t) {
    return super.append(...t), this;
  }
  /* Prepends children. Chainable. */
  prepend(...t) {
    return super.prepend(...t), this;
  }
}, { camelToKebab: l } = await use("@/tools/case.js"), y = (r, s) => class extends r {
  static __name__ = "attrs";
  #t = {};
  constructor() {
    super();
    const t = this, n = super.attributes;
    this.#t.attributes = new class {
      /* Returns attributes NamedNodeMap (for advanced use). */
      get attributes() {
        return n;
      }
      /* Returns number of set attributes. */
      get size() {
        return n.length;
      }
      /* Returns attribute entries. */
      entries() {
        return Array.from(n, (e) => [
          e.name,
          this.#e(e.value)
        ]);
      }
      /* Returns attribute value. */
      get(e) {
        if (e = l(e), !t.hasAttribute(e))
          return null;
        const i = t.getAttribute(e);
        return this.#e(i);
      }
      /* Checks, if attribute set. */
      has(e) {
        return e = l(e), t.hasAttribute(e);
      }
      /* Returns attribute keys (names). */
      keys() {
        return Array.from(n, (e) => e.name);
      }
      /* Sets one or more attribute values. Chainable with respect to component. */
      set(e, i) {
        if (e = l(e), i === void 0 || i === "...")
          return t;
        const o = this.#e(t.getAttribute(e));
        return i === o || ([!1, null].includes(i) ? t.removeAttribute(e) : i === !0 || !["number", "string"].includes(typeof i) ? t.setAttribute(e, "") : t.setAttribute(e, i)), t;
      }
      /* Updates one or more attribute values. Chainable with respect to component. */
      update(e = {}) {
        return Object.entries(e).forEach(([i, o]) => {
          this.set(i, o);
        }), t;
      }
      /* Returns attribute values (interpreted). */
      values() {
        return Array.from(n, (e) => e.value);
      }
      #e(e) {
        if (e === "")
          return !0;
        const i = Number(e);
        return isNaN(i) ? e || !0 : i;
      }
    }(), this.#t.attribute = new Proxy(this, {
      get(e, i) {
        return e.attributes.get(i);
      },
      set(e, i, o) {
        return e.attributes.set(i, o), !0;
      }
    });
  }
  attributeChangedCallback(t, n, e) {
    super.attributeChangedCallback?.(t, n, e), this.dispatchEvent(
      new CustomEvent("_attribute", { detail: { name: t, previous: n, current: e } })
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
        Object.entries(t).filter(([n, e]) => n.startsWith("[") && n.endsWith("]")).map(([n, e]) => [n.slice(1, -1), e])
      )
    ), this;
  }
}, x = (r, s) => class extends r {
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
      /* Adds classes. Chainable with respect to component. */
      add(n) {
        return n && t.classList.add(...n.split(".")), t;
      }
      /* Removes all classes. Chainable with respect to component. */
      clear() {
        for (const n of Array.from(t.classList))
          t.classList.remove(n);
        return t;
      }
      /* Checks, if classes are present. */
      has(n) {
        for (const e of n.split("."))
          if (!t.classList.contains(e))
            return !1;
        return !0;
      }
      /* Adds/removes classes according to condition. Chainable with respect 
      to component. */
      if(n, e) {
        return this[n ? "add" : "remove"](e), t;
      }
      /* Removes classes. Chainable with respect to component. */
      remove(n) {
        return n && t.classList.remove(...n.split(".")), t;
      }
      /* Replaces classes with substitutes. Chainable with respect to component.
      NOTE
      - Mismatch between 'classes' and 'substitutes' sizes are (intentionally) 
      silently ignored. */
      replace(n, e) {
        n = n.split("."), e = e.split(".");
        for (let i = 0; i < n.length; i++) {
          const o = e.at(i);
          if (o === void 0)
            break;
          t.classList.replace(n[i], o);
        }
        return t;
      }
      /* Toggles classes. Chainable with respect to component. */
      toggle(n, e) {
        for (const i of n.split("."))
          t.classList.toggle(i, e);
        return t;
      }
    }();
  }
  /* Returns constroller for managing CSS classes from '.'-separated strings. */
  get classes() {
    return this.#t.classes;
  }
  /* Updates CSS classes from '.'-syntax. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [n, e] of Object.entries(t))
      n.startsWith(".") && (e === void 0 || e === "..." || (n = n.slice(1), this.classes[e ? "add" : "remove"](n)));
    return this;
  }
}, w = (r, s) => class extends r {
  static __name__ = "clear";
  /* Clears content, optionally subject to selector. Chainable. */
  clear(t) {
    if (t) {
      const n = this.querySelectorAll(t);
      for (const e of n)
        e.remove();
    } else {
      for (; this.firstElementChild; )
        this.firstElementChild.remove();
      this.innerHTML = "";
    }
    return this;
  }
}, v = (r, s) => class extends r {
  static __name__ = "connect";
  connectedCallback() {
    super.connectedCallback?.(), this.dispatchEvent(new CustomEvent("_connect"));
  }
  disconnectedCallback() {
    super.disconnectedCallback?.(), this.dispatchEvent(new CustomEvent("_disconnect"));
  }
}, E = (r, s) => class extends r {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, A = (r, s) => class extends r {
  static __name__ = "find";
  /* Unified alternative to 'querySelector' and 'querySelectorAll' 
  with a leaner syntax. */
  find(t) {
    const n = this.querySelectorAll(t);
    return n.length === 1 ? n[0] : n.length ? n.values() : null;
  }
  search(t) {
    const n = this.querySelectorAll(t) || null;
    if (n)
      return n.values();
  }
}, j = (r, s) => class extends r {
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
class L {
  #t = {};
  constructor(s) {
    this.#t.owner = s, this.#t.on = new Proxy(this, {
      get(t, n) {
        throw new Error("'on' is write-only.");
      },
      set(t, n, e) {
        return t.add({ [n]: e }), !0;
      }
    });
  }
  /* Adds event handler with `on.type = handler`-syntax. */
  get on() {
    return this.#t.on;
  }
  add(s = {}) {
    const t = this.#t.owner;
    return Object.entries(s).forEach(([n, e]) => {
      const [i, ...o] = n.split("$");
      o.includes("once") ? t.addEventListener(i, e, { once: !0 }) : t.addEventListener(i, e), o.includes("run") && e({ target: t });
    }), t;
  }
  remove(s = {}) {
    return Object.entries(s).forEach(([t, n]) => {
      this.#t.owner.removeEventListener(t, n);
    }), this.#t.owner;
  }
}
const C = (r, s) => class extends r {
  static __name__ = "handlers";
  #t = {};
  constructor() {
    super(), this.#t.handlers = new L(this);
  }
  /* Returns controller for managing event handlers. */
  get handlers() {
    return this.#t.handlers;
  }
  /* Adds event handler with `on.type = handler`-syntax. */
  get on() {
    return this.#t.handlers.on;
  }
  addEventListener(t, n, e) {
    return super.addEventListener(t, n, e), k(n) ? n : this;
  }
  removeEventListener(t, n, ...e) {
    return super.removeEventListener(t, n, ...e), this;
  }
  /* Adds event handlers from '@'-syntax. Chainable. */
  update(t = {}) {
    return super.update?.(t), this.handlers.add(
      Object.fromEntries(
        Object.entries(t).filter(([n, e]) => n.startsWith("@")).map(([n, e]) => [n.slice(1), e])
      )
    ), this;
  }
};
function k(r) {
  return r.toString().includes("=>");
}
class O {
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
const P = (r, s, ...t) => class extends r {
  static __name__ = "insert";
  #t = {};
  __new__() {
    super.__new__?.(), this.#t.insert = new O(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, W = (r, s) => class extends r {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(t) {
    t ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
}, T = (r, s) => class extends r {
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
}, $ = (r, s) => class extends r {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [n, e] of Object.entries(t))
      n.startsWith("__") || !(n in this) && !n.startsWith("_") || e === void 0 || e === "..." || this[n] !== e && (this[n] = e);
    return this;
  }
}, H = (r, s) => class extends r {
  static __name__ = "send";
  /* Dispatches event with additional options and a leaner syntax. */
  send(t, { detail: n, trickle: e, ...i } = {}) {
    const o = n === void 0 ? new Event(t, i) : new CustomEvent(t, { detail: n, ...i });
    if (this.dispatchEvent(o), e) {
      const c = typeof e == "string" ? this.querySelectorAll(e) : this.children;
      for (const p of c)
        p.dispatchEvent(o);
    }
    return o;
  }
}, M = (r, s) => class extends r {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [n, e] of Object.entries(t))
      n in this || n in this.style && (e === void 0 || e === "..." || (e === null ? e = "none" : e === 0 ? e = "0" : typeof e == "number" && (e = `${e}rem`), this.style[n] !== e && (this.style[n] = e)));
    return this;
  }
}, S = (r, s, ...t) => class extends r {
  static __name__ = "super_";
  #t;
  __new__() {
    super.__new__?.();
    const n = (i) => super[i], e = (i, o) => {
      super[i] = o;
    };
    this.#t = new Proxy(this, {
      get(i, o) {
        return n(o);
      },
      set(i, o, c) {
        return e(o, c), !0;
      }
    });
  }
  /* Returns object, from which super items can be retrived/set. */
  get super_() {
    return this.#t;
  }
}, q = (r, s) => class extends r {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(t) {
    [!1, null].includes(t) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", t);
  }
}, N = (r, s) => class extends r {
  static __name__ = "text";
  /* Returns text content. */
  get text() {
    return this.textContent || null;
  }
  /* Sets text content. */
  set text(t) {
    this.textContent = t;
  }
}, V = (r, s) => class extends r {
  static __name__ = "vars";
  #t = {};
  constructor() {
    super(), this.#t.__ = new Proxy(this, {
      get(t, n) {
        if (n.startsWith("--") || (n = `--${n}`), t.isConnected) {
          const o = getComputedStyle(t).getPropertyValue(n).trim();
          if (!o) return !1;
          const c = t.style.getPropertyPriority(n);
          return c ? `${o} !${c}` : o === "none" ? null : o;
        }
        const e = t.style.getPropertyValue(n);
        if (!e) return !1;
        const i = t.style.getPropertyPriority(n);
        return i ? `${e} !${i}` : e === "none" ? null : e;
      },
      set(t, n, e) {
        if (n.startsWith("--") || (n = `--${n}`), e === null ? e = "none" : e === 0 && (e = "0"), e === void 0 || e === "...")
          return !0;
        const i = t.__[n];
        return e === i || (e === !1 ? t.style.removeProperty(n) : typeof e == "string" ? (e = e.trim(), e.endsWith("!important") ? t.style.setProperty(
          n,
          e.slice(0, -10),
          "important"
        ) : t.style.setProperty(n, e)) : t.style.setProperty(n, e)), !0;
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
    for (let [n, e] of Object.entries(t))
      n.endsWith("__") || n.startsWith("__") && (this.__[n.slice(2)] = e);
    return this;
  }
}, u = {
  append: m,
  attrs: y,
  classes: x,
  clear: w,
  connect: v,
  detail: E,
  find: A,
  for_: j,
  handlers: C,
  insert: P,
  novalidation: W,
  parent: T,
  props: $,
  send: H,
  style: M,
  super_: S,
  tab: q,
  text: N,
  vars: V
};
Object.freeze(u);
const a = new class {
  #t = {
    registry: /* @__PURE__ */ new Map()
  };
  add(r, s, t) {
    s ? Object.defineProperty(r, "__key__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: s
    }) : s = r.__key__, t ? Object.defineProperty(r, "__native__", {
      configurable: !1,
      enumerable: !0,
      writable: !1,
      value: t
    }) : t = r.__native__;
    const n = [s, r];
    return t && n.push({ extends: t }), customElements.define(...n), use.meta.DEV, this.#t.registry.set(s, r), r;
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
}(), z = (r) => {
  const s = `x-${r}`;
  if (a.has(s))
    return a.get(s);
  const t = document.createElement(r), n = t.constructor;
  if (n === HTMLUnknownElement)
    throw new Error(`'${r}' is not native.`);
  const e = Object.entries(u).filter(([i, o]) => !["for_", "novalidation", "text"].includes(i)).map(([i, o]) => o);
  return "textContent" in t && e.push(u.text), r === "form" && e.push(u.novalidation), r === "label" && e.push(u.for_), a.add(
    class extends _(n, {}, ...e) {
      static __key__ = s;
      static __native__ = r;
      constructor() {
        super(), this.setAttribute("web-component", "");
      }
    }
  );
}, h = (r) => {
  const s = z(r), t = new s();
  return f(t);
}, F = (r, ...s) => {
  const [t, ...n] = r.split("."), e = h(t);
  return n.length ? e(`${n.join(".")}`, ...s) : e(...s);
}, I = new Proxy(
  {},
  {
    get: (r, s) => h(s)
  }
), K = (r, s, t) => f(a.add(r, s, t)), D = Object.entries(u).filter(([r, s]) => !["for_", "novalidation"].includes(r)).map(([r, s]) => s), d = class extends _(HTMLElement, {}, ...D) {
};
a.has("x-component") || a.add(d, "x-component");
const U = f(d);
export {
  F as Component,
  h as Factory,
  U as WebComponent,
  K as author,
  I as component,
  f as factory,
  _ as mix,
  u as mixins,
  a as registry
};

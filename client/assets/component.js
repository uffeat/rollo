const { type: x } = await use("@/tools/type");
class j {
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
    return this.#t.updates === void 0 && (this.#t.updates = this.#t.args.find((s, t) => x(s) === "Object") || {}), this.#t.updates;
  }
}
const y = (i) => (...s) => {
  s = new j(s);
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
    return Array.isArray(t.at(0)) ? super.append(...t.at(0)) : super.append(...t), this;
  }
  /* Prepends children. Chainable. */
  prepend(...t) {
    return super.prepend(...t), this;
  }
}, { camelToKebab: b } = await use("@/tools/case"), O = (i, s) => class extends i {
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
};
class L {
  #t = {};
  constructor(s) {
    this.#t.owner = s;
  }
  get owner() {
    return this.#t.owner;
  }
  /* Returns classList (for advanced use). */
  get list() {
    return this.owner.classList;
  }
  /* Adds classes. */
  add(s) {
    const t = this.#e(s);
    return this.owner.classList.add(...t), this.owner;
  }
  /* Removes all classes. */
  clear() {
    for (const s of Array.from(owner.classList))
      this.owner.classList.remove(s);
    return this.owner.removeAttribute("class"), this.owner;
  }
  /* Checks, if classes are present. */
  has(s) {
    const t = this.#e(s);
    for (const e of t)
      if (!this.owner.classList.contains(e))
        return !1;
    return !0;
  }
  /* Adds/removes classes according to condition. */
  if(s, t) {
    return this[s ? "add" : "remove"](t), this.owner;
  }
  /* Removes classes. */
  remove(s) {
    const t = this.#e(s);
    return this.owner.classList.remove(...t), this.owner;
  }
  /* Replaces current with substitutes. 
        NOTE
        - If mismatch between 'current' and 'substitutes' sizes, substitutes are (intentionally) 
        silently ignored. */
  replace(s, t) {
    s = this.#e(s), t = this.#e(t);
    for (let e = 0; e < s.length; e++) {
      const n = t.at(e);
      if (n)
        this.owner.classList.replace(s[e], n);
      else
        break;
    }
    return this.owner;
  }
  /* Toggles classes. */
  toggle(s, t) {
    const e = this.#e(s);
    for (const n of e)
      this.owner.classList.toggle(n, t);
    return this.owner;
  }
  #e(s) {
    if (s) {
      const t = s.includes(".") ? "." : " ";
      return s.split(t).map((e) => e.trim()).filter((e) => !!e);
    }
    return [];
  }
}
const C = (i, s) => class extends i {
  static __name__ = "classes";
  #t = {};
  constructor() {
    super();
    const t = this;
    this.#t.classes = new L(this), this.#t.class = new Proxy(
      () => {
      },
      {
        get(e, n) {
          t.classes.add(n);
        },
        set(e, n, r) {
          return t.classes[r ? "add" : "remove"](n), !0;
        },
        apply(e, n, r) {
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
  update(t = {}) {
    super.update?.(t);
    for (const [e, n] of Object.entries(t))
      e.startsWith(".") && (n === void 0 || n === "..." || this.classes[n ? "add" : "remove"](e));
    return this;
  }
}, k = (i, s) => class extends i {
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
}, W = (i, s) => class extends i {
  static __name__ = "detail";
  #t = {
    detail: {}
  };
  /* Returns detail. */
  get detail() {
    return this.#t.detail;
  }
}, M = (i, s) => class extends i {
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
}, z = (i, s) => class extends i {
  static __name__ = "for_";
  /* Returns 'for' attribute. */
  get for_() {
    return this.getAttribute("for");
  }
  /* Sets 'for' attribute. */
  set for_(t) {
    t ? this.setAttribute("for", t) : this.removeAttribute("for");
  }
}, S = (i, s) => class extends i {
  static __name__ = "hook";
  hook(t) {
    return t ? t.call(this) ?? this : this;
  }
};
class H {
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
const V = (i, s, ...t) => class extends i {
  static __name__ = "insert";
  #t = {};
  __new__(...e) {
    super.__new__?.(...e), this.#t.insert = new H(this);
  }
  /* Inserts elements. 
  Syntactical alternative to insertAdjacentElement with a leaner syntax and 
  ability to handle multiple elements. */
  get insert() {
    return this.#t.insert;
  }
}, N = (i, s) => class extends i {
  static __name__ = "novalidation";
  /* Returns 'novalidation' attribute. */
  get novalidation() {
    return this.getAttribute("novalidation");
  }
  /* Sets 'novalidation' attribute. */
  set novalidation(t) {
    t ? this.setAttribute("novalidation", "") : this.removeAttribute("novalidation");
  }
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
}(), { type: d } = await use("@/tools/type"), { TaggedSets: R } = await use("@/tools/stores"), { defineValue: m } = await use("@/tools/define"), q = 3;
class D {
  #t = {};
  constructor(s) {
    this.#t.registry = R.create(), this.#t.owner = s;
  }
  get types() {
    return this.#t.registry.tags;
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
const I = (i, s) => class extends i {
  static __name__ = "on";
  #t = {};
  constructor() {
    super();
    const e = this;
    this.#t.registry = new D(this);
    const n = new class {
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
          get(u, _) {
            return (...h) => {
              const a = h.find((f) => typeof f == "function"), l = h.find((f) => d(f) === "Object") || {};
              if (_ === "use")
                return e.addEventListener(c, a, l);
              if (_ === "unuse")
                return e.removeEventListener(c, a, l);
              throw new Error(`Invalid key: ${_}`);
            };
          },
          apply(u, _, h) {
            const a = h.find((f) => typeof f == "function"), l = h.find((f) => d(f) === "Object") || {};
            return e.addEventListener(c, a, l);
          }
        });
      },
      /* Enable syntax like:
      button.on.click((event) => console.log("Clicked"));
      button.on['click.run']((event) => console.log("Clicked"));
      */
      set(r, o, c) {
        const [u, ..._] = o.split(".");
        return e.addEventListener(
          u,
          c,
          Object.fromEntries(_.map((h) => [h, !0]))
        ), !0;
      },
      /* Enable syntax like:
      button.on({ click: (event) => console.log("Clicked") });
      button.on({ once: true }, { click: (event) => console.log("Clicked") });
      button.on("click", (event) => console.log("Clicked"));
      button.on("click", (event) => console.log("Clicked"), { once: true });
      */
      apply(r, o, c) {
        return e.addEventListener(...c);
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
  addEventListener(...e) {
    const [n, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], {
      once: o = !1,
      run: c = !1,
      track: u = !1,
      ..._
    } = e.find((a, l) => l && d(a) === "Object") || {};
    u && !o && this.#t.registry.add(n, r), super.addEventListener(n, r, { once: o, ..._ });
    const h = {
      handler: r,
      once: o,
      remove: () => {
        this.removeEventListener(n, r, { track: u });
      },
      run: c,
      target: this,
      track: u,
      type: n,
      ..._
    };
    if (c) {
      const a = this.constructor.create();
      a.addEventListener(
        n,
        (l) => {
          m(l, "currentTarget", this), m(l, "target", this), m(l, "noevent", !0), r(l, h);
        },
        { once: !0 }
      ), n.startsWith("_") || n.includes("-") ? a.dispatchEvent(new CustomEvent(n)) : `on${n}` in a && n in a && typeof a[n] == "function" ? a[n]() : a.dispatchEvent(new Event(n));
    }
    return h;
  }
  /* Deregisters event handler.
  Overloads original 'removeEventListener'. Does not break original API, but 
  handles additional options makes chainable and enables object-based args.
  "Point-of-truth" event handler deregistration. */
  removeEventListener(...e) {
    const [n, r] = typeof e[0] == "string" ? e : Object.entries(e[0])[0], { track: o = !1, ...c } = e.find((u, _) => _ && d(u) === "Object") || {};
    return o && this.#t.registry.remove(n, r), super.removeEventListener(n, r, c), this;
  }
  /* Adds event handlers from the special on-syntax. */
  update(e = {}) {
    super.update?.(e);
    for (const [n, r] of Object.entries(e))
      if (n.startsWith("on.")) {
        const [o, ...c] = n.slice(q).split("."), u = Object.fromEntries(c.map((_) => [_, !0]));
        this.addEventListener(o, r, u);
      }
    return this;
  }
}, F = (i, s) => class extends i {
  static __name__ = "owner";
  #t = {};
  get owner() {
    return this.#t.owner;
  }
  set owner(t) {
    this.#t.owner = t, this.attribute && (this.attribute = t && "uid" in t ? t.uid : t);
  }
}, K = (i, s) => class extends i {
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
}, U = (i, s) => class extends i {
  static __name__ = "props";
  /* Updates accessor props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (const [e, n] of Object.entries(t))
      e.startsWith("__") || !(e in this) && !e.startsWith("_") || n === void 0 || n === "..." || this[e] !== n && (typeof n == "function" ? n((r) => this[e] = r) : this[e] = n);
    return this;
  }
}, B = (i, s) => class extends i {
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
}, G = (i, s) => class extends i {
  static __name__ = "style";
  /* Updates style props. Chainable. */
  update(t = {}) {
    super.update?.(t);
    for (let [e, n] of Object.entries(t))
      e in this || e in this.style && (n === void 0 || n === "..." || (n === null ? n = "none" : n === 0 && (n = "0"), this.style[e] !== n && (this.style[e] = n)));
    return this;
  }
}, J = (i, s, ...t) => class extends i {
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
}, Q = (i, s) => class extends i {
  static __name__ = "tab";
  /* Returns tabindex. */
  get tab() {
    return this.getAttribute("tabindex");
  }
  /* Sets tabindex. */
  set tab(t) {
    [!1, null].includes(t) ? this.removeAttribute("tabindex") : this.setAttribute("tabindex", t);
  }
}, X = (i, s) => class extends i {
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
let Y = 0;
const Z = (i, s) => class extends i {
  static __name__ = "uid";
  __new__(...t) {
    super.__new__?.(...t), this.setAttribute("uid", `uid${Y++}`);
  }
  /* Returns uid. */
  get uid() {
    return this.getAttribute("uid");
  }
}, tt = (i, s) => class extends i {
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
}, et = 9, st = -3, g = Object.freeze(
  Object.fromEntries(
    Object.entries(
      /* @__PURE__ */ Object.assign({
        "./mixins/append.js": A,
        "./mixins/attrs.js": O,
        "./mixins/classes.js": C,
        "./mixins/clear.js": k,
        "./mixins/connect.js": P,
        "./mixins/data.js": $,
        "./mixins/detail.js": W,
        "./mixins/find.js": M,
        "./mixins/for_.js": z,
        "./mixins/hook.js": S,
        "./mixins/insert.js": V,
        "./mixins/novalidation.js": N,
        "./mixins/on.js": I,
        "./mixins/owner.js": F,
        "./mixins/parent.js": K,
        "./mixins/props.js": U,
        "./mixins/send.js": B,
        "./mixins/style.js": G,
        "./mixins/super_.js": J,
        "./mixins/tab.js": Q,
        "./mixins/text.js": X,
        "./mixins/uid.js": Z,
        "./mixins/vars.js": tt
      })
    ).map(([i, s]) => [i.slice(et, st), s])
  )
), nt = (...i) => {
  const s = i.filter(
    (r) => typeof r == "string" && !r.startsWith("!")
  ), t = i.filter((r) => typeof r == "string" && r.startsWith("!")).map((r) => r.slice(1)), e = i.filter((r) => typeof r == "function");
  t.push("for_", "novalidation");
  const n = Object.entries(g).filter(([r, o]) => s.includes(r) ? !0 : !t.includes(r)).map(([r, o]) => o);
  return n.push(...e), n;
}, { stateMixin: rt } = await use("@/state"), it = (i) => {
  const s = `x-${i}`;
  if (p.has(s))
    return p.get(s);
  const t = document.createElement(i), e = t.constructor;
  if (e === HTMLUnknownElement)
    throw new Error(`'${i}' is not native.`);
  const n = nt("!text", rt);
  return "textContent" in t && n.push(g.text), i === "form" && n.push(g.novalidation), i === "label" && n.push(g.for_), p.add(
    class v extends E(e, {}, ...n) {
      static __key__ = s;
      static __native__ = i;
      static create = (...o) => {
        const c = new v();
        return y(c)(...o);
      };
      __new__(...o) {
        super.__new__?.(...o), this.setAttribute("web-component", "");
      }
    }
  );
}, w = (i) => {
  const s = it(i), t = new s();
  return y(t);
}, ut = (i, ...s) => {
  const [t, ...e] = i.split("."), n = w(t);
  return e.length ? n(`${e.join(".")}`, ...s) : n(...s);
}, _t = new Proxy(
  {},
  {
    get(i, s) {
      return w(s);
    }
  }
), { defineValue: ot } = await use("@/tools/define"), lt = (i, s, t) => (p.add(i, s, t), ot(i, "create", y(i)), i.create);
export {
  ut as Component,
  w as Factory,
  nt as Mixins,
  lt as author,
  _t as component,
  y as factory,
  E as mix,
  g as mixins,
  p as registry
};

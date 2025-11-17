const m = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", m);
const g = new m(), { Exception: l } = await use("@/tools/exception.js"), { camelToKebab: w } = await use("@/tools/case.js"), { truncate: S } = await use("@/tools/truncate.js"), { type: R } = await use("@/tools/type.js"), c = "@media";
class f {
  static create = (...e) => new f(...e);
  #e = {};
  constructor(e) {
    this.#e.owner = e;
  }
  /* Returns owner sheet. */
  get owner() {
    return this.#e.owner;
  }
  /* Returns number of current rules. */
  get size() {
    return this.owner.cssRules.length;
  }
  /* Returns text representation of current sheet. */
  get text() {
    return Array.from(
      this.owner.cssRules,
      (e) => S(e.cssText)
    ).join(" ");
  }
  /* Adds rules. */
  add(e) {
    for (const [s, r] of Object.entries(e))
      this.#t(this.owner, this.#i(s, r), r);
    return this;
  }
  /* Removes all rules. */
  clear() {
    for (; this.size; )
      this.owner.deleteRule(this.size - 1);
    return this;
  }
  /* Returns rule. */
  find(e) {
    return this.#r(this.owner, this.#i(e));
  }
  /* Removes rules. */
  remove(...e) {
    return this.#o(this.owner, ...e);
  }
  /* Updates or creates rules. */
  update(e) {
    for (let [s, r] of Object.entries(e)) {
      s = this.#i(s, r);
      const t = this.#r(this.owner, s);
      if (t) {
        if (t instanceof CSSStyleRule)
          this.#s(t, r);
        else if (t instanceof CSSMediaRule)
          for (const [i, n] of Object.entries(r)) {
            const u = this.#r(t, i);
            u ? this.#s(u, n) : this.#t(t, i, n);
          }
        else if (t instanceof CSSKeyframesRule)
          for (const [i, n] of Object.entries(r)) {
            const u = t.findRule(`${i}%`);
            u ? this.#s(u, n) : this.#t(t, selector, n);
          }
      } else
        this.#t(this.owner, s, r);
    }
    return this;
  }
  #t(e, s, r) {
    (!("cssRules" in e) || !("insertRule" in e)) && l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
    const t = e.cssRules[e.insertRule(`${s} { }`, e.cssRules.length)];
    if (t instanceof CSSStyleRule)
      return this.#s(t, r);
    if (t instanceof CSSMediaRule) {
      for (const [i, n] of Object.entries(r))
        this.#t(t, i, n);
      return t;
    }
    if (t instanceof CSSKeyframesRule) {
      for (const [i, n] of Object.entries(r))
        t.appendRule(`${i}% { }`), this.#s(t.findRule(`${i}%`), n);
      return t;
    }
  }
  #r(e, s) {
    "cssRules" in e || l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
    const r = Array.from(e.cssRules);
    return s.startsWith(c) ? (s = s.slice(c.length).trim(), r.filter((t) => t instanceof CSSMediaRule).find((t) => t.conditionText === s) || null) : r.filter((t) => t instanceof CSSStyleRule).find((t) => t.selectorText === s) || null;
  }
  #n(e) {
    const s = Number(Object.keys(e)[0]);
    return typeof s == "number" && !Number.isNaN(s);
  }
  #i(e, s) {
    return e.startsWith("max") ? `@media (width <= ${e.slice(3)}px)` : e.startsWith("min") ? `@media (width >= ${e.slice(3)}px)` : !e.startsWith("@keyframes") && s && this.#n(s) ? `@keyframes ${e}` : e;
  }
  #o(e, ...s) {
    (!("cssRules" in e) || !("deleteRule" in e)) && l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
    const r = Array.from(e.cssRules);
    for (let t of s) {
      let i;
      t.startsWith(c) ? (t = t.slice(c.length).trim(), i = r.filter((n) => n instanceof CSSMediaRule).findIndex((n) => n.conditionText === t)) : i = r.filter((n) => n instanceof CSSStyleRule).findIndex((n) => n.selectorText === t), i > -1 && e.deleteRule(i);
    }
    return e;
  }
  #s(e, s = {}) {
    e instanceof CSSRule || l.raise("Invalid rule.", () => console.error("rule:", e));
    for (let [r, t] of Object.entries(s))
      if (t !== void 0) {
        if (R(t) === "Object") {
          const [i, n] = Object.entries(t)[0];
          t = `${n}${i}`;
        }
        if (r.startsWith("__") ? r = `--${r.slice(2)}` : r.startsWith("--") || (r = w(r.trim())), t === !1) {
          e.style.removeProperty(r);
          continue;
        }
        if (!this.#u(r))
          throw new Error(`Invalid key: ${r}`);
        if (typeof t == "string") {
          t = t.trim(), t.endsWith("!important") ? e.style.setProperty(
            r,
            t.slice(0, -10),
            "important"
          ) : e.style.setProperty(r, t);
          continue;
        }
        t === null && (t = "none"), e.style.setProperty(r, t);
      }
    return e;
  }
  #u(e) {
    return e in g.style || e.startsWith("--");
  }
}
class h {
  static create = (...e) => new h(...e);
  #e = { registry: /* @__PURE__ */ new Set() };
  constructor(e) {
    this.#e.owner = e;
  }
  /* Returns owner sheet. */
  get owner() {
    return this.#e.owner;
  }
  /* Returns number of targets. */
  get size() {
    return this.#e.registry.size;
  }
  /* Adopts owner sheet to target. */
  add(e) {
    this.has(e) || (this.#e.registry.add(e), e.adoptedStyleSheets.push(this.owner));
  }
  /* Checks, if target has adopted owner sheet. */
  has(e) {
    return this.#e.registry.has(e);
  }
  /* Unadopts owner sheet from target. */
  remove(e) {
    if (this.has(e)) {
      this.#e.registry.delete(e);
      const s = e.adoptedStyleSheets;
      for (let r = s.length - 1; r >= 0; r--)
        s[r] === this.owner && s.splice(r, 1);
    }
  }
}
const { type: d } = await use("@/tools/type.js");
class y extends CSSStyleSheet {
  static create = (...e) => new y(...e);
  #e = {
    detail: {}
  };
  constructor(...e) {
    super(), this.#e.rules = f.create(this), this.#e.targets = h.create(this), this.#e.text = e.find((t, i) => !i && typeof t == "string"), this.#e.path = e.find((t, i) => i && typeof t == "string");
    const s = e.find((t) => d(t) === "Object"), r = e.find((t) => d(t) === "Object" && t !== s);
    this.text && this.replaceSync(this.text), s && this.rules.add(s), Object.assign(this.detail, r);
  }
  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#e.detail;
  }
  /* Returns path (if provided). Useful for soft identification. */
  get path() {
    return this.#e.path;
  }
  get rules() {
    return this.#e.rules;
  }
  /* Returns targets controller. */
  get targets() {
    return this.#e.targets;
  }
  /* Returns text representation of original sheet. */
  get text() {
    return this.#e.text;
  }
  /* Unadopts sheet from targets. */
  unuse(...e) {
    e.length || e.push(document);
    for (const s of e) {
      const r = s.shadowRoot || s;
      this.targets.remove(r);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...e) {
    e.length || e.push(document);
    for (const s of e) {
      const r = s.shadowRoot || s;
      this.targets.add(r);
    }
    return this;
  }
}
const { camelToKebab: a } = await use("@/tools/case.js"), x = document.documentElement, p = new class {
  #e = {};
  constructor() {
    this.#e.color = new class {
      get hex() {
        return new Proxy(
          {},
          {
            get(o, e) {
              return `#${e}`;
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
        get(o, e) {
          return `var(--${a(e, { numbers: !0 })})`;
        }
      }
    );
  }
  get root() {
    return new Proxy(
      {},
      {
        get(o, e) {
          return getComputedStyle(x).getPropertyValue(`--${a(e, { numbers: !0 })}`).trim();
        }
      }
    );
  }
  get color() {
    return this.#e.color;
  }
  get value() {
    return new Proxy(
      {},
      {
        get(o, e) {
          return a(e, { numbers: !0 });
        }
      }
    );
  }
  attr(o) {
    return `attr(${o})`;
  }
  important(...o) {
    return `${o.join(" ")} !important`;
  }
  rotate(o) {
    return `rotate(${o})`;
  }
}(), $ = new Proxy(() => {
}, {
  get(o, e) {
    return e in p ? p[e] : e in g.style ? new Proxy(
      {},
      {
        get(s, r) {
          return { [e]: a(r, { numbers: !0 }) };
        }
      }
    ) : (s) => (e === "pct" && (e = "%"), `${s}${e}`);
  },
  apply(o, e, s) {
    return s = s.map((r) => r === "!" ? "!important" : r), s.join(" ");
  }
}), j = (o) => `[uid="${o.uid}"]`;
export {
  f as Rules,
  y as Sheet,
  h as Targets,
  $ as css,
  j as scope
};

const { typeName: h } = await use("/tools/types.js"), { camelToKebab: a } = await use("/tools/case.js"), { truncate: d } = await use("/tools/truncate.js"), l = "@media";
class u {
  static create = (...e) => new u(...e);
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
      (e) => d(e.cssText)
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
          for (const [n, i] of Object.entries(r)) {
            const o = this.#r(t, n);
            o ? this.#s(o, i) : this.#t(t, n, i);
          }
        else if (t instanceof CSSKeyframesRule)
          for (const [n, i] of Object.entries(r)) {
            const o = t.findRule(`${n}%`);
            o ? this.#s(o, i) : this.#t(t, selector, i);
          }
      } else
        this.#t(this.owner, s, r);
    }
    return this;
  }
  #t(e, s, r) {
    if (!("cssRules" in e) || !("insertRule" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const t = e.cssRules[e.insertRule(`${s} { }`, e.cssRules.length)];
    if (t instanceof CSSStyleRule)
      return this.#s(t, r);
    if (t instanceof CSSMediaRule) {
      for (const [n, i] of Object.entries(r))
        this.#t(t, n, i);
      return t;
    }
    if (t instanceof CSSKeyframesRule) {
      for (const [n, i] of Object.entries(r))
        t.appendRule(`${n}% { }`), this.#s(t.findRule(`${n}%`), i);
      return t;
    }
  }
  #r(e, s) {
    if (!("cssRules" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const r = Array.from(e.cssRules);
    return s.startsWith(l) ? (s = s.slice(l.length).trim(), r.filter((t) => t instanceof CSSMediaRule).find((t) => t.conditionText === s) || null) : r.filter((t) => t instanceof CSSStyleRule).find((t) => t.selectorText === s) || null;
  }
  #n(e) {
    const s = Number(Object.keys(e)[0]);
    return typeof s == "number" && !Number.isNaN(s);
  }
  #i(e, s) {
    return e.startsWith("max") ? `@media (width <= ${e.slice(3)}px)` : e.startsWith("min") ? `@media (width >= ${e.slice(3)}px)` : !e.startsWith("@keyframes") && s && this.#n(s) ? `@keyframes ${e}` : e;
  }
  #o(e, ...s) {
    if (!("cssRules" in e) || !("deleteRule" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const r = Array.from(e.cssRules);
    for (let t of s) {
      let n;
      t.startsWith(l) ? (t = t.slice(l.length).trim(), n = r.filter((i) => i instanceof CSSMediaRule).findIndex((i) => i.conditionText === t)) : n = r.filter((i) => i instanceof CSSStyleRule).findIndex((i) => i.selectorText === t), n > -1 && e.deleteRule(n);
    }
    return e;
  }
  #s(e, s = {}) {
    if (!(e instanceof CSSRule))
      throw console.error("rule:", e), new Error("Invalid rule.");
    for (let [r, t] of Object.entries(s))
      if (t !== void 0) {
        if (h(t) === "Object") {
          const [n, i] = Object.entries(t)[0];
          t = `${i}${n}`;
        }
        if (r.startsWith("__") ? r = `--${r.slice(2)}` : r.startsWith("--") || (r = a(r.trim())), t === !1) {
          e.style.removeProperty(r);
          continue;
        }
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
}
class c {
  static create = (...e) => new c(...e);
  #e = { registry: /* @__PURE__ */ new Set() };
  constructor(e) {
    this.#e.owner = e;
  }
  /* Returns owner sheet. */
  get owner() {
    return this.#e.owner;
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
class f extends CSSStyleSheet {
  static create = (...e) => new f(...e);
  #e = {
    detail: {}
  };
  constructor(e, s) {
    super(), this.#e.rules = u.create(this), this.#e.targets = c.create(this), this.replaceSync(e), this.#e.path = s, this.#e.text = e;
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
    e.length === 0 && e.push(document);
    for (const s of e) {
      const r = s.shadowRoot || s;
      this.targets.remove(r);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...e) {
    e.length === 0 && e.push(document);
    for (const s of e) {
      const r = s.shadowRoot || s;
      this.targets.add(r);
    }
    return this;
  }
}
const p = new Proxy(
  {},
  {
    get(w, e) {
      return (s) => `${s}${e}`;
    }
  }
);
export {
  f as Sheet,
  p as css
};

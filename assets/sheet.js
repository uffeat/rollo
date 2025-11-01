const { typeName: w } = await use("@/tools/types.js"), { camelToKebab: p } = await use("@/tools/case.js"), { truncate: m } = await use("@/tools/truncate.js"), { WebComponent: S } = await use("@/component.js"), { Exception: R } = await use("exception.js"), l = "@media";
class u {
  static create = (...e) => new u(...e);
  #e = {
    validator: S()
  };
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
      (e) => m(e.cssText)
    ).join(" ");
  }
  /* Adds rules. */
  add(e) {
    for (const [r, s] of Object.entries(e))
      this.#t(this.owner, this.#i(r, s), s);
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
    for (let [r, s] of Object.entries(e)) {
      r = this.#i(r, s);
      const t = this.#r(this.owner, r);
      if (t) {
        if (t instanceof CSSStyleRule)
          this.#s(t, s);
        else if (t instanceof CSSMediaRule)
          for (const [n, i] of Object.entries(s)) {
            const o = this.#r(t, n);
            o ? this.#s(o, i) : this.#t(t, n, i);
          }
        else if (t instanceof CSSKeyframesRule)
          for (const [n, i] of Object.entries(s)) {
            const o = t.findRule(`${n}%`);
            o ? this.#s(o, i) : this.#t(t, selector, i);
          }
      } else
        this.#t(this.owner, r, s);
    }
    return this;
  }
  #t(e, r, s) {
    if (!("cssRules" in e) || !("insertRule" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const t = e.cssRules[e.insertRule(`${r} { }`, e.cssRules.length)];
    if (t instanceof CSSStyleRule)
      return this.#s(t, s);
    if (t instanceof CSSMediaRule) {
      for (const [n, i] of Object.entries(s))
        this.#t(t, n, i);
      return t;
    }
    if (t instanceof CSSKeyframesRule) {
      for (const [n, i] of Object.entries(s))
        t.appendRule(`${n}% { }`), this.#s(t.findRule(`${n}%`), i);
      return t;
    }
  }
  #r(e, r) {
    if (!("cssRules" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const s = Array.from(e.cssRules);
    return r.startsWith(l) ? (r = r.slice(l.length).trim(), s.filter((t) => t instanceof CSSMediaRule).find((t) => t.conditionText === r) || null) : s.filter((t) => t instanceof CSSStyleRule).find((t) => t.selectorText === r) || null;
  }
  #n(e) {
    const r = Number(Object.keys(e)[0]);
    return typeof r == "number" && !Number.isNaN(r);
  }
  #i(e, r) {
    return e.startsWith("max") ? `@media (width <= ${e.slice(3)}px)` : e.startsWith("min") ? `@media (width >= ${e.slice(3)}px)` : !e.startsWith("@keyframes") && r && this.#n(r) ? `@keyframes ${e}` : e;
  }
  #o(e, ...r) {
    if (!("cssRules" in e) || !("deleteRule" in e))
      throw console.error("container:", e), new Error("Invalid container.");
    const s = Array.from(e.cssRules);
    for (let t of r) {
      let n;
      t.startsWith(l) ? (t = t.slice(l.length).trim(), n = s.filter((i) => i instanceof CSSMediaRule).findIndex((i) => i.conditionText === t)) : n = s.filter((i) => i instanceof CSSStyleRule).findIndex((i) => i.selectorText === t), n > -1 && e.deleteRule(n);
    }
    return e;
  }
  #s(e, r = {}) {
    if (!(e instanceof CSSRule))
      throw console.error("rule:", e), new Error("Invalid rule.");
    for (let [s, t] of Object.entries(r))
      if (t !== void 0) {
        if (w(t) === "Object") {
          const [n, i] = Object.entries(t)[0];
          t = `${i}${n}`;
        }
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = p(s.trim())), t === !1) {
          e.style.removeProperty(s);
          continue;
        }
        if (!this.#l(s))
          throw new Error(`Invalid key: ${s}`);
        if (typeof t == "string") {
          t = t.trim(), t.endsWith("!important") ? e.style.setProperty(
            s,
            t.slice(0, -10),
            "important"
          ) : e.style.setProperty(s, t);
          continue;
        }
        t === null && (t = "none"), e.style.setProperty(s, t);
      }
    return e;
  }
  #l(e) {
    return e in this.#e.validator.style || e.startsWith("--");
  }
}
class a {
  static create = (...e) => new a(...e);
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
      const r = e.adoptedStyleSheets;
      for (let s = r.length - 1; s >= 0; s--)
        r[s] === this.owner && r.splice(s, 1);
    }
  }
}
class f extends CSSStyleSheet {
  static create = (...e) => new f(...e);
  #e = {
    detail: {}
  };
  constructor(e, r) {
    super(), this.#e.rules = u.create(this), this.#e.targets = a.create(this), this.replaceSync(e), this.#e.path = r, this.#e.text = e;
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
    for (const r of e) {
      const s = r.shadowRoot || r;
      this.targets.remove(s);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...e) {
    e.length === 0 && e.push(document);
    for (const r of e) {
      const s = r.shadowRoot || r;
      this.targets.add(s);
    }
    return this;
  }
}
const { camelToKebab: d } = await use("@/tools/case.js"), { WebComponent: g } = await use("@/component.js"), y = g(), h = new class {
  #e = {};
  constructor() {
    this.#e.color = new class {
      get hex() {
        return new Proxy(
          {},
          {
            get(c, e) {
              return `#${e}`;
            }
          }
        );
      }
    }();
  }
  get color() {
    return this.#e.color;
  }
  get value() {
    return new Proxy(
      {},
      {
        get(c, e) {
          return d(e);
        }
      }
    );
  }
}(), x = new Proxy(() => {
}, {
  get(c, e) {
    return e in y.style ? new Proxy(
      {},
      {
        get(r, s) {
          return { [e]: d(s) };
        }
      }
    ) : e in h ? h[e] : (r) => (e === "pct" && (e = "%"), `${r}${e}`);
  },
  apply(c, e, r) {
    return r.join(" ");
  }
});
export {
  f as Sheet,
  x as css
};

const m = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("sheet-reference", m);
const g = new m(), { Exception: l } = await use("@/tools/exception"), { camelToKebab: w } = await use("@/tools/case"), { truncate: S } = await use("@/tools/truncate"), { type: R } = await use("@/tools/type"), c = "@media";
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
    for (const [r, s] of Object.entries(e))
      this.#t(this.owner, this.#n(r, s), s);
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
    return this.#r(this.owner, this.#n(e));
  }
  /* Removes rules. */
  remove(...e) {
    return this.#o(this.owner, ...e);
  }
  /* Updates or creates rules. */
  update(e) {
    for (let [r, s] of Object.entries(e)) {
      r = this.#n(r, s);
      const t = this.#r(this.owner, r);
      if (t) {
        if (t instanceof CSSStyleRule)
          this.#s(t, s);
        else if (t instanceof CSSMediaRule)
          for (const [n, i] of Object.entries(s)) {
            const u = this.#r(t, n);
            u ? this.#s(u, i) : this.#t(t, n, i);
          }
        else if (t instanceof CSSKeyframesRule)
          for (const [n, i] of Object.entries(s)) {
            const u = t.findRule(`${n}%`);
            u ? this.#s(u, i) : this.#t(t, selector, i);
          }
      } else
        this.#t(this.owner, r, s);
    }
    return this;
  }
  #t(e, r, s) {
    (!("cssRules" in e) || !("insertRule" in e)) && l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
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
    "cssRules" in e || l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
    const s = Array.from(e.cssRules);
    return r.startsWith(c) ? (r = r.slice(c.length).trim(), s.filter((t) => t instanceof CSSMediaRule).find((t) => t.conditionText === r) || null) : s.filter((t) => t instanceof CSSStyleRule).find((t) => t.selectorText === r) || null;
  }
  #i(e) {
    const r = Number(Object.keys(e)[0]);
    return typeof r == "number" && !Number.isNaN(r);
  }
  #n(e, r) {
    return e.startsWith("max") ? `@media (width <= ${e.slice(3)}px)` : e.startsWith("min") ? `@media (width >= ${e.slice(3)}px)` : !e.startsWith("@keyframes") && r && this.#i(r) ? `@keyframes ${e}` : e;
  }
  #o(e, ...r) {
    (!("cssRules" in e) || !("deleteRule" in e)) && l.raise(
      "Invalid container.",
      () => console.error("container:", e)
    );
    const s = Array.from(e.cssRules);
    for (let t of r) {
      let n;
      t.startsWith(c) ? (t = t.slice(c.length).trim(), n = s.filter((i) => i instanceof CSSMediaRule).findIndex((i) => i.conditionText === t)) : n = s.filter((i) => i instanceof CSSStyleRule).findIndex((i) => i.selectorText === t), n > -1 && e.deleteRule(n);
    }
    return e;
  }
  #s(e, r = {}) {
    e instanceof CSSRule || l.raise("Invalid rule.", () => console.error("rule:", e));
    for (let [s, t] of Object.entries(r))
      if (t !== void 0) {
        if (R(t) === "Object") {
          const [n, i] = Object.entries(t)[0];
          t = `${i}${n}`;
        }
        if (s.startsWith("__") ? s = `--${s.slice(2)}` : s.startsWith("--") || (s = w(s.trim())), t === !1) {
          e.style.removeProperty(s);
          continue;
        }
        if (!this.#u(s))
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
      const r = e.adoptedStyleSheets;
      for (let s = r.length - 1; s >= 0; s--)
        r[s] === this.owner && r.splice(s, 1);
    }
  }
}
const { type: d } = await use("@/tools/type");
class y extends CSSStyleSheet {
  static create = (...e) => new y(...e);
  #e = {
    detail: {}
  };
  constructor(...e) {
    super(), this.#e.rules = f.create(this), this.#e.targets = h.create(this), this.#e.text = e.find((t, n) => !n && typeof t == "string"), this.#e.path = e.find((t, n) => n && typeof t == "string");
    const r = e.find((t) => d(t) === "Object"), s = e.find((t) => d(t) === "Object" && t !== r);
    this.text && this.replaceSync(this.text), r && this.rules.add(r), Object.assign(this.detail, s);
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
  disable() {
    return this.disabled = !0, this;
  }
  enable() {
    return this.disabled = !1, this;
  }
  /* Unadopts sheet from targets. */
  unuse(...e) {
    e.length || e.push(document);
    for (const r of e) {
      const s = r.shadowRoot || r;
      this.targets.remove(s);
    }
    return this;
  }
  /* Adopts sheet to targets. */
  use(...e) {
    e.length || e.push(document);
    for (const r of e) {
      const s = r.shadowRoot || r;
      this.targets.add(s);
    }
    return this;
  }
}
const { camelToKebab: a } = await use("@/tools/case"), $ = document.documentElement, p = new class {
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
          return getComputedStyle($).getPropertyValue(`--${a(e, { numbers: !0 })}`).trim();
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
}(), v = new Proxy(() => {
}, {
  get(o, e) {
    return e in p ? p[e] : e in g.style ? new Proxy(
      {},
      {
        get(r, s) {
          return { [e]: a(s, { numbers: !0 }) };
        }
      }
    ) : (r) => (e === "pct" && (e = "%"), `${r}${e}`);
  },
  apply(o, e, r) {
    return r = r.map((s) => s === "!" ? "!important" : s), r.join(" ");
  }
}), { type: b } = await use("@/tools/type"), j = (o) => {
  let e = "";
  const r = new class {
    attrs(t) {
      for (const [n, i] of Object.entries(t))
        i === !0 ? e += `[${n}]` : e += `[${n}="${i}"]`;
    }
    child(t) {
      e += ` > ${t}`;
    }
    classes(...t) {
      for (const n of t)
        e += `.${n}`;
    }
    has(t) {
      e += `:has(${descendant})`;
    }
    in(t) {
      e += ` ${t}`;
    }
    is(t) {
      e += `:is(${descendant})`;
    }
    not(t) {
      e += `:not(${descendant})`;
    }
  }(), s = new Proxy(() => {
  }, {
    get(t, n) {
      if (n in r) {
        const i = r[n];
        if (typeof i == "function")
          return (...u) => (i(...u), s);
      }
      return n === "_" ? (e += " ", s) : (e += n, s);
    },
    apply(t, n, i) {
      const u = i[0];
      return b(u) === "Object" ? { [e]: u } : (e += u, s);
    }
  });
  return s;
}, O = (o) => `[uid="${o.uid}"]`;
export {
  f as Rules,
  y as Sheet,
  h as Targets,
  v as css,
  j as rule,
  O as scope
};

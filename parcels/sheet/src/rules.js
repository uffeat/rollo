import { reference } from "./reference.js";

const { typeName } = await use("@/tools/types.js");
const { camelToKebab } = await use("@/tools/case.js");
const { truncate } = await use("@/tools/truncate.js");
const { Exception } = await use("Exception");

const MEDIA = "@media";

/* Utility for light-weight dynamic rule control. */
export class Rules {
  static create = (...args) => new Rules(...args);

  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Returns owner sheet. */
  get owner() {
    return this.#_.owner;
  }

  /* Returns number of current rules. */
  get size() {
    return this.owner.cssRules.length;
  }

  /* Returns text representation of current sheet. */
  get text() {
    return Array.from(this.owner.cssRules, (rule) =>
      truncate(rule.cssText)
    ).join(" ");
  }

  /* Adds rules. */
  add(spec) {
    for (const [head, body] of Object.entries(spec)) {
      this.#appendRule(this.owner, this.#parse(head, body), body);
    }
    return this;
  }

  /* Removes all rules. */
  clear() {
    while (this.size) {
      this.owner.deleteRule(this.size - 1);
    }
    return this;
  }

  /* Returns rule. */
  find(arg) {
    return this.#findRule(this.owner, this.#parse(arg));
  }

  /* Removes rules. */
  remove(...heads) {
    return this.#removeRules(this.owner, ...heads);
  }

  /* Updates or creates rules. */
  update(spec) {
    for (let [head, body] of Object.entries(spec)) {
      head = this.#parse(head, body);
      const rule = this.#findRule(this.owner, head);
      if (rule) {
        if (rule instanceof CSSStyleRule) {
          this.#updateRule(rule, body);
        } else if (rule instanceof CSSMediaRule) {
          for (const [selector, updates] of Object.entries(body)) {
            const r = this.#findRule(rule, selector);
            if (r) {
              this.#updateRule(r, updates);
            } else {
              this.#appendRule(rule, selector, updates);
            }
          }
        } else if (rule instanceof CSSKeyframesRule) {
          for (const [frame, updates] of Object.entries(body)) {
            const r = rule.findRule(`${frame}%`);
            if (r) {
              this.#updateRule(r, updates);
            } else {
              this.#appendRule(rule, selector, updates);
            }
          }
        }
      } else {
        this.#appendRule(this.owner, head, body);
      }
    }
    return this;
  }

  #appendRule(container, head, body) {
    if (!("cssRules" in container) || !("insertRule" in container))
      Exception.raise(`Invalid container.`, () =>
        console.error(`container:`, container)
      );
    const rule =
      container.cssRules[
        container.insertRule(`${head} { }`, container.cssRules.length)
      ];
    if (rule instanceof CSSStyleRule) {
      return this.#updateRule(rule, body);
    }
    if (rule instanceof CSSMediaRule) {
      for (const [selector, updates] of Object.entries(body)) {
        this.#appendRule(rule, selector, updates);
      }
      return rule;
    }
    if (rule instanceof CSSKeyframesRule) {
      for (const [frame, updates] of Object.entries(body)) {
        rule.appendRule(`${frame}% { }`);
        this.#updateRule(rule.findRule(`${frame}%`), updates);
      }
      return rule;
    }
  }

  #findRule(container, head) {
    if (!("cssRules" in container))
      Exception.raise(`Invalid container.`, () =>
        console.error(`container:`, container)
      );
    const rules = Array.from(container.cssRules);
    if (head.startsWith(MEDIA)) {
      head = head.slice(MEDIA.length).trim();
      return (
        rules
          .filter((r) => r instanceof CSSMediaRule)
          .find((r) => r.conditionText === head) || null
      );
    }
    return (
      rules
        .filter((r) => r instanceof CSSStyleRule)
        .find((r) => r.selectorText === head) || null
    );
  }

  #isKeyframes(body) {
    const converted = Number(Object.keys(body)[0]);
    return typeof converted === "number" && !Number.isNaN(converted);
  }

  #parse(head, body) {
    if (head.startsWith("max")) {
      return `@media (width <= ${head.slice(3)}px)`;
    }
    if (head.startsWith("min")) {
      return `@media (width >= ${head.slice(3)}px)`;
    }
    if (!head.startsWith("@keyframes") && body && this.#isKeyframes(body)) {
      return `@keyframes ${head}`;
    }
    return head;
  }

  #removeRules(container, ...heads) {
    if (!("cssRules" in container) || !("deleteRule" in container))
      Exception.raise(`Invalid container.`, () =>
        console.error(`container:`, container)
      );
    const rules = Array.from(container.cssRules);

    for (let head of heads) {
      let index;
      if (head.startsWith(MEDIA)) {
        head = head.slice(MEDIA.length).trim();
        index = rules
          .filter((r) => r instanceof CSSMediaRule)
          .findIndex((r) => r.conditionText === head);
      } else {
        index = rules
          .filter((r) => r instanceof CSSStyleRule)
          .findIndex((r) => r.selectorText === head);
      }
      if (index > -1) {
        container.deleteRule(index);
      }
    }
    return container;
  }

  #updateRule(rule, updates = {}) {
    if (!(rule instanceof CSSRule))
      Exception.raise(`Invalid rule.`, () => console.error(`rule:`, rule));

    for (let [key, value] of Object.entries(updates)) {
      /* Ignore, if undefined, e.g., for efficient use of iife's */
      if (value === undefined) {
        continue;
      }

      if (typeName(value) === "Object") {
        const [u, v] = Object.entries(value)[0];
        value = `${v}${u}`;
      }

      if (key.startsWith("__")) {
        key = `--${key.slice(2)}`;
      } else if (!key.startsWith("--")) {
        key = camelToKebab(key.trim());
      }
      /* By convention, false removes */
      if (value === false) {
        rule.style.removeProperty(key);
        continue;
      }

      if (!this.#validate(key)) {
        throw new Error(`Invalid key: ${key}`);
      }

      if (typeof value === "string") {
        value = value.trim();
        /* Handle priority */
        if (value.endsWith("!important")) {
          rule.style.setProperty(
            key,
            value.slice(0, -"!important".length),
            "important"
          );
        } else {
          rule.style.setProperty(key, value);
        }
        continue;
      }
      /* Interpret value as per conventions */
      if (value === null) {
        value = "none";
      }
      rule.style.setProperty(key, value);
    }
    return rule;
  }

  #validate(key) {
    return key in reference.style || key.startsWith("--");
  }
}


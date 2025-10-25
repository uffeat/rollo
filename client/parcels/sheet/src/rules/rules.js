import "../../use.js";
import { append } from "./tools/append.js";
import { find } from "./tools/find.js";
import { parse } from "./tools/parse.js";
import { remove } from "./tools/remove.js";
import { update } from "./tools/update.js";

const { truncate } = await use("/tools/text/truncate.js");

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
      append.call(this.owner, parse(head, body), body);
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

  find(arg) {
    if (typeof arg === "function") {
      return; // TODO
    }
    return find.call(this.owner, parse(arg));
  }

  remove(...heads) {
    return remove.call(this.owner, ...heads);
  }

  search(arg) {
    const result = [];
  }

  /* Updates or creates rules. */
  update(spec, { clear = false } = {}) {
    for (let [head, body] of Object.entries(spec)) {
      head = parse(head, body);
      const rule = find.call(this.owner, head);
      if (rule) {
        if (rule instanceof CSSStyleRule) {
          update.call(rule, body);
        } else if (rule instanceof CSSMediaRule) {
          for (const [selector, updates] of Object.entries(body)) {
            const r = find.call(rule, selector);
            if (r) {
              update.call(r, updates);
            } else {
              append.call(rule, selector, updates);
            }
          }
        } else if (rule instanceof CSSKeyframesRule) {
          for (const [frame, updates] of Object.entries(body)) {
            const r = rule.findRule(`${frame}%`);
            if (r) {
              update.call(r, updates);
            } else {
              append.call(rule, selector, updates);
            }
          }
        }
      } else {
        append.call(this.owner, head, body);
      }
    }
    return this;
  }
}

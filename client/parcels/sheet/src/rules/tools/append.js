import { update } from "./update.js";

export function append(head, body) {
  if (!("cssRules" in this) || !("insertRule" in this)) {
    console.error(`Context:`, this);
    throw new Error(`Invalid context.`);
  }
  const rule =
    this.cssRules[this.insertRule(`${head} { }`, this.cssRules.length)];
  if (rule instanceof CSSStyleRule) {
    return update.call(rule, body);
  }
  if (rule instanceof CSSMediaRule) {
    for (const [selector, updates] of Object.entries(body)) {
      append.call(rule, selector, updates);
    }
    return rule;
  }
  
  if (rule instanceof CSSKeyframesRule) {
    for (const [frame, updates] of Object.entries(body)) {
          rule.appendRule(`${frame}% { }`);
          update.call(rule.findRule(`${frame}%`), updates);
        }
    return rule;
  }
}

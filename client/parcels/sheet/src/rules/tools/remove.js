const MEDIA = "@media";

/* Removes rules. Should be bound to object with cssRules and deleteRule. */
export function remove(...heads) {
  if (!("cssRules" in this) || !("deleteRule" in this)) {
    console.error(`Context:`, this);
    throw new Error(`Invalid context.`);
  }
  const rules = Array.from(this.cssRules);

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
      this.deleteRule(index);
    }
  }
  return this;
}

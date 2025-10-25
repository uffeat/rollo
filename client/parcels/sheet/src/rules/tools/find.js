const MEDIA = '@media'

/* . */
export function find(head) {
  if (!("cssRules" in this)) {
    console.error(`Context:`, this);
    throw new Error(`Invalid context.`);
  }
  const rules = Array.from(this.cssRules)
  if (head.startsWith(MEDIA)) {
    head = head.slice(MEDIA.length).trim()
    return rules.filter((r) => r instanceof CSSMediaRule).find((r) => r.conditionText === head) || null
  }
  return rules.filter((r) => r instanceof CSSStyleRule).find((r) => r.selectorText === head) || null


}

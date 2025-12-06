import "../../use.js";
import { replaceImages } from "../../src/tools/images.js";

const { component } = await use("@/component");

/* */
export const Card = ({ html, path }) => {
  /* XXX Build tools produce the full card html (keep it that way for clarity 
  and consistency). This could be injected directly into page. However, we want
  a top-level component handle. So to avoid over-nesting (and styling issues), 
  we create a fresh component, and transfer first child's classes and html. */
  const first = component.div({ innerHTML: html }).firstChild;
  const card = component.div(first.className, { innerHTML: first.innerHTML });
  card.attribute.card = path;
  replaceImages(card);
  return card;
};
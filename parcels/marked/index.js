import "./use";
import { Marked, marked } from "marked";
import { baseUrl } from "marked-base-url";
import { createDirectives } from "marked-directive";

marked.use({
  async: false,
  pedantic: false,
  gfm: true,
});

marked.use(baseUrl(use.meta.base));

/* Returns text with most common zerowidth characters removed from the start. */
const clean = (text) => {
  return text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
};

export { Marked, marked, baseUrl, createDirectives, clean };

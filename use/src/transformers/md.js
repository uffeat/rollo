/* Adds support for runtime MD parsing, incl. Frontmatter-style.
NOTE Caches by default, but possible to opt out. */
import { use } from "../use";

const cache = new Map();

use.types.add("md", async (text, { options, path }) => {
  // Options guard guard
  if (options.raw) return;
  if (options.cache !== false && cache.has(path.full)) {
    return cache.get(path.full);
  }
  // Type guard
  if (!(typeof text === "string")) return;
  const { marked } = await use("@/marked");
  let result;
  if (text.startsWith("---")) {
    // Frontmatter style
    const { YAML } = await use("@/yaml");
    const [yaml, md] = text.split("---").slice(1);
    const meta = Object.freeze(YAML.parse(yaml));
    const html = marked.parse(md);
    result = Object.freeze({ meta, html });
  } else {
    // Pure MD
    result = marked.parse(text);
  }
  if (options.cache !== false) {
    cache.set(path.full, result);
  }
  return result;
});

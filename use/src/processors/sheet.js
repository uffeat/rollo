/* Adopts Sheet instance to targets. */

import { use } from "../use";
import { typeName } from "../tools";

use.processors.add("css", async (result, options, ...args) => {
  // Type guard
  if (typeName(result) !== "CSSStyleSheet") return;
  const targets = args.filter(
    (a) =>
      typeName(a) === "HTMLDocument" || a instanceof ShadowRoot || a.shadowRoot,
  );
  if (targets.length) {
    // NOTE sheet.use() adopts to document, therefore check targets' length
    result.use(...targets);
  }
});

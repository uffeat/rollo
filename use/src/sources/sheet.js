/* Registers asset carrier sheet as source (@/).
NOTE 
- Tightly coupled with build tools and parcels.
- Always returns raw asset, subject to any subsequent transformation and 
  processing.
- Attractive because:
  - Does not hit bundle size.
  - Low latency.
  - Serialized out-of-the-box
*/

import { UseError } from "../tools";
import { use } from "../use";

const cache = new Map();

use.sources.add("@", ({ path }) => {
  if (cache.has(path.full)) {
    return cache.get(path.full);
  }
  const probe = document.createElement("meta");
  document.head.append(probe);
  probe.setAttribute("__path__", path.path);
  const propertyValue = getComputedStyle(probe)
    .getPropertyValue("--__asset__")
    .trim();
  probe.remove();
  if (!propertyValue) {
    UseError.raise(`Invalid path: ${path.full}`);
  }
  const result = atob(propertyValue.slice(1, -1));
  cache.set(path.full, result);
  return result;
});

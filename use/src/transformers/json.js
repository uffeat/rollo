/* Adds json support.
- Text -> JS object.
- Does not cache to avoid mutation issues. 
*/
import { use } from "../use";

use.types.add("json", (result) => {
  /* Type guard */
  if (!(typeof result === "string")) return;
  return JSON.parse(result);
});

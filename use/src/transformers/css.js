/* Adds css support: Text -> Sheet instance. */
import { use } from "../use";

const cache = new Map();

use.types.add("css", async (text, { path }) => {
  // Type guard
  if (!(typeof text === "string")) return;
  const { Sheet } = await use("@/rollo/");
  const key = path.full;
  if (cache.has(key)) return cache.get(key);
  const result = Sheet.create(text, key);
  cache.set(key, result);
  return result;
});

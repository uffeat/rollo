/* Adds js support.
- Base case: Text -> module.
- With `{as: 'function'}` option: Text -> iife. 
  Can sometimes be a cleaner alternative to the `{as: 'script'}` option
  and can be used for '@/' imports. 
*/
import { use } from "../use";

const cache = new Map();
const processing = new Map();

use.types.add("js", async (text, { options, owner, path }) => {
  // Type guard
  if (!(typeof text === "string")) return;
  let result;
  const { as } = options;
  const key = as === "function" ? `${path.full}?${as}` : path.full;
  if (cache.has(key)) {
    return cache.get(key);
  }
  if (processing.has(key)) {
    const promise = processing.get(key);
    const result = await promise;
    processing.delete(key);
    return result;
  } else {
    const { promise, resolve, reject } = Promise.withResolvers();
    processing.set(key, promise);
    try {
      if (as === "function") {
        result = Function(`return ${text}`)();
        if (result === undefined) {
          // Since undefined results are ignored, convert to null
          result = null;
        }
      } else {
        result = await owner.module(
          `export const __path__ = "${path.path}";${text}`,
          path.path,
        );
      }
      resolve(result);
      cache.set(key, result);
      return result;
    } catch (error) {
      reject(error);
      throw error;
    } finally {
      processing.delete(key);
    }
  }
});

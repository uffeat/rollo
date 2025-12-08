import { type } from "@/type.js";

/* Checks, if target and other contains the same entries. 
NOTE
- Intended for flat objects with primitive values. */
export const match = (target, other) => {
  if (type(target) !== "Object" || type(other) !== "Object") {
    return false;
  }
  /* Remove items with undefined values */
  (() => {
    const predicate = ([k, v]) => v !== undefined;
    target = Object.fromEntries(Object.entries(target).filter(predicate));
    other = Object.fromEntries(Object.entries(other).filter(predicate));
  })();

  if (Object.keys(target).length !== Object.keys(other).length) return false;
  for (const [key, value] of Object.entries(target)) {
    if (other[key] !== value) return false;
  }
  return true;
};

/* EXAMPLES

const target = {
  foo: 8,
  bar: 42,
};

const other = {
  foo: 8,
  bar: 42,
}

console.log(match(target, other)); // true

*/

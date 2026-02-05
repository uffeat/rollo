import { type } from "./type";

/* Returns interpretation of target where top-level entries with undefined 
values have been removed. */
const normalize = (target) => {
  return Object.fromEntries(
    Object.entries(target).filter(([k, v]) => v !== undefined)
  );
};

/* Deep equality comparison for nested objects and arrays. Ignores properties 
with undefined values (treats them as non-existent). Uses iterative approach 
for robustness with deep nesting. */
export const match = (a, b, _match = (a, b) => a === b) => {
  /* Stack holds pairs to compare */
  const stack = [[a, b]];

  while (stack.length > 0) {
    const [a, b] = stack.pop();
    const [typeA, typeB] = [type(a), type(b)];
    /* Different types -> not equal */
    if (typeA !== typeB) return false;
    /* Primitives and null -> direct comparison */
    if (!["Array", "Object"].includes(typeA)) {
      if (!_match(a, b)) return false;
      continue;
    }
    /* Arrays: Compare length and push elements to stack */
    if (typeA === "Array") {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        stack.push([a[i], b[i]]);
      }
      continue;
    }
    /* Objects: Normalize, compare keys, push values to stack */
    if (typeA === "Object") {
      const [_a, _b] = [normalize(a), normalize(b)];
      const keys = Object.keys(_a);
      /* Different number of keys -> not equal */
      if (keys.length !== Object.keys(_b).length) return false;
      /* Check all keys exist in both */
      for (const key of keys) {
        if (!(key in _b)) return false;
        stack.push([_a[key], _b[key]]);
      }
    }
  }
  return true;
};

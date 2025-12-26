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
export const match = (a, b) => {
  /* Stack holds pairs to compare */
  const stack = [{ a, b }];

  while (stack.length > 0) {
    let { a, b } = stack.pop();
    
    const [typeA, typeB] = [type(a), type(b)];
    /* Different types -> not equal */
    if (typeA !== typeB) return false;
    /* Primitives and null -> direct comparison */
    if (typeA !== "Object" && typeA !== "Array") {
      if (a !== b) return false;
      continue;
    }
    /* Arrays: Compare length and push elements to stack */
    if (typeA === "Array") {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        stack.push({ a: a[i], b: b[i] });
      }
      continue;
    }

    /* Objects: Normalize, compare keys, push values to stack */
    if (typeA === "Object") {
      a = normalize(a);
      b = normalize(b);

      const keys = Object.keys(a);
    

      /* Different number of keys -> not equal */
      if (keys.length !== Object.keys(b).length) return false;

      /* Check all keys exist in both */
      for (const key of keys) {
        if (!(key in b)) return false;
        stack.push({ a: a[key], b: b[key] });
      }
    }
  }

  return true;
};

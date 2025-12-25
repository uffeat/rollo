import { type } from "./type";


/* Removes undefined object vales (shallow) */
const normalize = (obj) => {
  if (type(obj) !== "Object") return obj;
  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      normalized[key] = value;
    }
  }
  return normalized;
};

/* Deep equality comparison for nested objects and arrays. Ignores properties 
with undefined values (treats them as non-existent). Uses iterative approach 
for robustness with deep nesting. */
export const match = (target, other) => {
  

  /* Stack holds pairs to compare */
  const stack = [{ a: target, b: other }];

  while (stack.length > 0) {
    const { a, b } = stack.pop();

    /* Get types */
    const typeA = type(a);
    const typeB = type(b);

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
      const normA = normalize(a);
      const normB = normalize(b);

      const keysA = Object.keys(normA);
      const keysB = Object.keys(normB);

      /* Different number of keys = not equal */
      if (keysA.length !== keysB.length) return false;

      /* Check all keys exist in both */
      for (const key of keysA) {
        if (!(key in normB)) return false;
        stack.push({ a: normA[key], b: normB[key] });
      }
    }
  }

  return true;
};

import { is } from "./is";

const push = (stack, value) => {
  if (value && typeof value === "object") {
    stack.push(value);
  }
};

/* Deep freezes nested structures of objects, arrays, Maps, and Sets. 
Takes an iterative approach for robustness with deep nesting. */
export const freeze = (value) => {
  const stack = [value];
  while (stack.length) {
    const value = stack.pop();
    /* Freeze the value */
    Object.freeze(value);
    /* Maps and Sets */
    if (is.map(value) || is.set(value)) {
      for (const v of value.values()) {
        push(stack, v);
      }
      continue;
    }
    /* Plain objects and arrays */
    for (const v of Object.values(value)) {
      push(stack, v);
    }
  }
  return value;
};

import { is } from "./is";
import { type } from "./type";



/* Merges nested structures. Arrays are treated as atomic values by default 
(replaced entirely), but a function for custom array handling can be provided. 
Implements the "undefined-means-delete" Rollo convention for objects. 
Takes an iterative approach for robustness with deep nesting. */
export const merge = (target, source, merger) => {
  /* Stack holds pairs of target/source to process iteratively */
  const stack = [[target, source]];

  while (stack.length) {
    const [target, source] = stack.pop();

    for (const [key, value] of Object.entries(source)) {
      /* Remove property if value is undefined */
      if (value === undefined) {
        delete target[key];
        continue;
      }
      const _value = target[key];
      const types = [type(_value), type(value)];
      /* Deep merge if both are plain objects */
      if (types.every(is.object)) {
        stack.push([_value, value]);
        continue;
      }
      /* Overwrite */
      target[key] =
        merger && types.every(is.array) ? merger(_value, value) : value;
    }
  }
  return target;
};

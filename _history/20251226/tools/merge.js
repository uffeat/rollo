import { type } from "./type";

/* Merges nested structures. Arrays are treated as atomic values by default 
(replaced entirely), but a function for custom array handling can be provided. 
Implements the undefined-means-delete Rollo convention for objects. 
Takes iterative approach for robustness with deep nesting. */
export const merge = (target, source, merger) => {
  /* Stack holds pairs of target/source to process iteratively, and the 
  merger function to pass down through the structure */
  const stack = [{ target, source, merger }];

  while (stack.length > 0) {
    const {
      target: currentTarget,
      source: currentSource,
      merger,
    } = stack.pop();

    for (const [key, value] of Object.entries(currentSource)) {
      /* Remove property if value is undefined */
      if (value === undefined) {
        delete currentTarget[key];
        continue;
      }

      /* Deep merge if both are plain objects */
      if (type(value) === "Object" && type(currentTarget[key]) === "Object") {
        stack.push({
          target: currentTarget[key],
          source: value,
          merger,
        });
      } else if (
      /* Handle arrays: use custom merger if provided, otherwise replace */
        type(value) === "Array" &&
        type(currentTarget[key]) === "Array" &&
        merger
      ) {
        currentTarget[key] = merger(currentTarget[key], value);
      } else {
        /* For primitives, arrays (without merger), or type mismatches: overwrite */
        currentTarget[key] = value;
      }
    }
  }

  return target;
};

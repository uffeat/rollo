import { type } from "./type";

/* Like deepAssign but also handles nested structures. Arrays are treated 
  as atomic values by default (replaced entirely), but you can provide a 
  custom arrayMerger function for special handling. Implements the 
  undefined-means-delete Rollo convention for objects. Uses iterative 
  approach for robustness with deep nesting. */
export const merge = (target, source, arrayMerger = null) => {
  /* Stack holds pairs of target/source to process iteratively, plus the 
  arrayMerger function to pass down through the structure */
  const stack = [{ target, source, arrayMerger }];

  while (stack.length > 0) {
    const {
      target: currentTarget,
      source: currentSource,
      arrayMerger,
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
          arrayMerger,
        });
      } else if (
      /* Handle arrays: use custom merger if provided, otherwise replace */
        type(value) === "Array" &&
        type(currentTarget[key]) === "Array" &&
        arrayMerger
      ) {
        currentTarget[key] = arrayMerger(currentTarget[key], value);
      } else {
        /* For primitives, arrays (without merger), or type mismatches: overwrite */
        currentTarget[key] = value;
      }
    }
  }

  return target;
};

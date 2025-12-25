import { type } from "../type";

/* Variation of Object.assign that can handle nested objects and implements 
the undefined-means-delete Rollo convention for source. Uses iterative 
approach instead of recursion for robustness with deeply nested structures. */
export const assign = (target, source) => {
  /* Stack holds pairs of target/source objects to process.
     We work through nested objects iteratively to avoid call stack limits. */
  const stack = [{ target, source }];

  while (stack.length > 0) {
    const { target: currentTarget, source: currentSource } = stack.pop();

    for (const [key, value] of Object.entries(currentSource)) {
      /* Remove property if value is undefined */
      if (value === undefined) {
        delete currentTarget[key];
        continue;
      }

      /* If both values are plain objects, push them onto the stack 
         for deep merging instead of processing immediately */
      if (type(value) === "Object" && type(currentTarget[key]) === "Object") {
        stack.push({
          target: currentTarget[key],
          source: value,
        });
      } else {
        /* For primitives, arrays, or type mismatches: overwrite directly */
        currentTarget[key] = value;
      }
    }
  }

  return target;
};

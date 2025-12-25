import { type } from "../type";

/* Variation of Object.assign that can handle nested objects and implements 
the undefined-means-delete Rollo convention for source. */
export const assign = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    /* Remove property if value is undefined */
    if (value === undefined) {
      delete target[key];
      continue;
    }
    /* Deep merge if both target and source values are plain objects */
    if (
      type(value) === 'Object' && 
      type(target[key]) === 'Object'
    ) {
      assign(target[key], value);
    } else {
      /* Overwrite non-object values directly */
      target[key] = value;
    }
  }
  return target;
};
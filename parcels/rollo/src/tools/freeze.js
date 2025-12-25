import { type } from "./type";

/* Deep-freezes nested data structures. 
Supports plain objects, arrays, maps and sets.  */
export const freeze = (target) => {
  Object.freeze(target);
  /* Maps and Sets */
  if (target instanceof Map) {
    target.forEach((value) => {
      if (type(value) === "Object") {
        freeze(value);
      }
    });
  } else if (target instanceof Set) {
    target.forEach((value) => {
      if (type(value) === "Object") {
        freeze(value);
      }
    });
  } else {
    /* Plain objects and arrays */
    Object.values(target).forEach((value) => {
      if (type(value) === "Object") {
        freeze(value);
      }
    });
  }
  return target;
};


export const deepFreeze = freeze
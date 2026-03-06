import { is } from "./is";

export const remove = (target, ...args) => {
  if (is.object(target)) {
    for (const key of args) {
      delete target[key];
    }
    return target;
  }

  if (is.map(target)) {
    for (const key of args) {
      target.delete(key);
    }
    return target;
  }

  if (is.set(target)) {
    for (const key of args) {
      target.delete(key);
    }
    return target;
  }

  if (is.array(target)) {
    /* If target array is empty or no args provided, return immediately */
    if (!target.length || !args.length) return target;
    /* Iterate backward to avoid index shifting issues */
    for (let i = args.length - 1; i >= 0; i--) {
      /* If current element is in args, remove it */
      if (args.includes(target[i])) {
        target.splice(i, 1); /* splice removes the element in-place */
      }
    }
    return target;
  }
};

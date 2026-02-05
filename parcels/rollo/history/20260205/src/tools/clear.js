import { Exception } from "./exception";
import { is } from "./is";



export const clear = (target) => {
  if (is.object(target)) {
    Object.keys(target).forEach(k => delete target[k]);
    return target;
  }

  if (is.map(target)) {
    target.clear()
    return target;
  }

  if (is.set(target)) {
    target.clear()
    return target;
  }

  if (is.array(target)) {
    target.length = 0
    return target;
  }
};

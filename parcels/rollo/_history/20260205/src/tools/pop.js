import { is } from "./is";
import { remove } from "./remove";
import { unwrap } from "./array/unwrap";

export const pop = (target, ...args) => {
  if (is.object(target)) {
    const values = args.map((key) => {
      const value = target[key];
      delete target[key];
      return value;
    });
    return unwrap(values);
  }

  if (is.map(target)) {
    const values = args.map((key) => {
      const value = target.get(key);
      target.delete(key);
      return value;
    });
    return unwrap(values);
  }

  if (is.set(target)) {
    for (const key of args) {
      target.delete(key);
    }
    return unwrap(args);
  }

  if (is.array(target)) {
    remove(target, ...args);
    return unwrap(args);
  }
};

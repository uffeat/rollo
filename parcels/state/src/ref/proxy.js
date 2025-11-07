import { Ref } from "./ref.js";

const Exception = await use("Exception");

/* Proxy version of Ref with a leaner syntax: Update/access to current happens 
via direct function call. */
export const ref = (...args) => {
  const instance = Ref.create(...args);
  return new Proxy(() => {}, {
    get(target, key) {
      Exception.if(!(key in instance), `Invalid key: ${key}`);
      return instance[key];
    },
    set(target, key, value) {
      Exception.if(!(key in instance), `Invalid key: ${key}`);
      instance[key] = value;
      return true;
    },
    apply(target, thisArg, args) {
      /* Turn apply into a getter-setter hybrid for current */
      instance.update(...args);
      return instance.current;
    },
  });
};

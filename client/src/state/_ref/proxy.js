import { Exception } from '@/tools/exception'
import { Ref } from "./ref";

/* Proxy version of Ref with a leaner syntax: Update/access to current happens 
via direct function call. */
export const ref = (...args) => {
  const instance = Ref.create(...args);
  return new Proxy(() => {}, {
    get(target, key) {
      Exception.if(!(key in instance), `Invalid key: ${key}`);
      const value = instance[key];
      if (typeof value === 'function') {
        return value.bind(instance)
      }
      return value
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

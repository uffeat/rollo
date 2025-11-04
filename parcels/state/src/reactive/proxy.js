const Exception = await use("exception.js");
const { typeName } = await use("@/tools/types.js");
const { match: arrayMatch } = await use("@/tools/array/match.js");
const { match: objectMatch } = await use("@/tools/object/match.js");




export const reactive = (...args) => {
  const instance = Reactive.create(...args);
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
      /* Turn apply into a getter-setter hybrid */
      instance.update(...args);
      return instance.current;
    },
  });
}


export const defineMethod = (
  target,
  name,
  value,
  {
    bind = true,
    configurable = true,
    enumerable = true,
    writable = true,
  } = {}
) => {
  if (bind) {
    value = value.bind(target);
  }
  Object.defineProperty(target, name, {
    configurable,
    enumerable,
    writable,
    value,
  });
  return target;
};

export const defineProperty = (
  target,
  name,
  { bind = true, configurable = true, enumerable = false, get, set } = {}
) => {
  if (bind) {
    get = get.bind(target);
  }
  const options = {
    configurable,
    enumerable,
    get,
  };
  if (set) {
    if (bind) {
      set = set.bind(target);
    }
    options.set = set;
  }
  Object.defineProperty(target, name, options);
  return target;
};

export const defineValue = (
  target,
  name,
  value,
  {
    bind = true,
    configurable = false,
    enumerable = true,
    writable = false,
  } = {}
) => {
  if (bind && value.bind) {
    value = value.bind(target);
  }
  Object.defineProperty(target, name, {
    configurable,
    enumerable,
    writable,
    value,
  });
  return target;
};

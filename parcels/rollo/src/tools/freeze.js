export const deepFreeze = (target) => {
  Object.freeze(target);
  /* Maps and Sets */
  if (target instanceof Map) {
    target.forEach(value => {
      if (value && typeof value === 'object') deepFreeze(value);
    });
  } else if (target instanceof Set) {
    target.forEach(value => {
      if (value && typeof value === 'object') deepFreeze(value);
    });
  } else {
    /* Plain objects and arrays */
    Object.values(target).forEach(value => {
      if (value && typeof value === 'object') {
        deepFreeze(value);
      }
    });
  }
  return target;
}
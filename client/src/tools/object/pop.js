export const pop = (target, ...keys) => {
  const values = keys.map((key) => {
    const value = target[key];
    delete target[key];
    return value;
  });
  if (values.length === 1) {
    return values[0]
  }
  return values
};

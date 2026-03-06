export const mix = (base, config, ...mixins) => {
  let cls = base;
  for (const mixin of mixins) {
    cls = mixin(cls, config, ...mixins);
  }
  return cls;
};

export const type = (value) => {
  if (typeof value === "object") {
    /* Rollo convention to deflate the broad nature of 'Object' results and to 
    allow using 'type' as an alternative to 'instanceof'. */
    if (value?.__type__) {
      return value.__type__;
    }
    if (value?.constructor?.__type__) {
      /* NOTE `value.constructor.name` would have been cleaner, but would break 
      after minification. */
      return value.constructor.__type__;
    }
  }
  return Object.prototype.toString.call(value).slice(8, -1);
};

/* Alias to 'type'. Useful in contexts where the common 'type' name is used 
for something else. */
export const typeName = type;



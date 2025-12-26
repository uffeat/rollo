export const type = (value) => {
  if (typeof value === "object") {
    /* Rollo convention: If 'value' is an instance of a class that has a static 
    '__type__' value that value becomes the result. This is a pragmatic way of 
    deflating broad nature of 'Object' results and allows using 'type' as an 
    alternative to 'instanceof'. */
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



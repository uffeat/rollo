export default (parent, config) => {
  return class extends parent {
    static __name__ = "props";
    /* Updates accessor props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      for (const [key, value] of Object.entries(updates)) {
        /* Ignore __ keys */
        if (key.startsWith("__")) {
          continue;
        }
        /* Ignore non-prop keys, but allow psudo-private */
        if (!(key in this) && !key.startsWith("_")) {
          continue;
        }
        /* Ignore undefined values, e.g., for efficient use of iife's.*/
        if (value === undefined) {
          continue;
        }
        /* Ignore no change */
        if (this[key] === value) {
          continue;
        }
        /* Update */
         this[key] = value;
      }
      return this;
    }
  };
};

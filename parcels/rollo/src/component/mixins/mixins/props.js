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
        /* Ignore undefined'...' values, e.g., for efficient use of iife's.
        NOTE '...' is used as a proxy for undefined to enable use from Python, 
        which does not support undefined */
        if (value === undefined || value === "...") {
          continue;
        }
        /* Ignore no change */
        if (this[key] === value) {
          continue;
        }
        /* Update */
        if (typeof value === "function") {
          value((v) => (this[key] = v));
        } else {
          this[key] = value;
        }
      }
      return this;
    }
  };
};

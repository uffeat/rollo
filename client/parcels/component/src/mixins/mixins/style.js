export default (parent, config) => {
  return class extends parent {
    static __name__ = "style";
    /* Updates style props. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      for (let [key, value] of Object.entries(updates)) {
        /* Ignore ambiguos prop/style keys */
        if (key in this) {
          continue;
        }
        /* Ignore non-style prop key */
        if (!(key in this.style)) {
          continue;
        }

        /* Ignore undefined/'...' values, e.g., for efficient use of iife's.
        NOTE '...' is used as a proxy for undefined to enable use from Python, 
        which does not support undefined */
        if (value === undefined || value === "...") {
          continue;
        }

        /* Interpret value as per conventions */
        if (value === null) {
          value = "none";
        } else if (value === 0) {
          value = "0";
        } else if (typeof value === "number") {
          value = `${value}rem`;
        }

        /* Ignore no change */
        if (this.style[key] === value) {
          continue;
        }
        /* Update */
        this.style[key] = value;
      }

      return this;
    }
  };
};

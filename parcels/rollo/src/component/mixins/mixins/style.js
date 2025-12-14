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

        /* Ignore undefined, e.g., for efficient use of iife's.  */
        if (value === undefined) {
          continue;
        }

        /* Interpret value as per conventions */
        if (value === null) {
          value = "none";
        } else if (value === 0) {
          value = "0";
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

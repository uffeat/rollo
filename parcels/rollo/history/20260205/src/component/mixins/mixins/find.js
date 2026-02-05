export default (parent, config) => {
  return class extends parent {
    static __name__ = "find";
    /* Unified alternative to 'querySelector' and 'querySelectorAll' 
    with a leaner syntax. */
    find(selector) {
      const elements = this.querySelectorAll(selector);
      if (elements.length === 1) {
        return elements[0];
      }
      /* NOTE Return values() to enable direct use of iterator helpers. */
      return elements.length ? elements.values() : null;
    }

    search(selector) {
      /* Alternative to 'querySelectorAll' with a leaner syntax. */
      const elements = this.querySelectorAll(selector) || null;
      if (elements) {
        /* NOTE Return values() to enable direct use of iterator helpers. */
        return elements.values();
      }
    }
  };
};

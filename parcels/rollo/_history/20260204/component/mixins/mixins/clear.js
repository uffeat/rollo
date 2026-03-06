export default (parent, config) => {
  return class extends parent {
    static __name__ = "clear";
    /* Clears content, optionally subject to selector. Chainable. */
    clear(selector) {
      if (selector) {
        for (const child of Array.from(this.children)) {
          if (child.matches(selector)) {
            child.remove();
          }
        }
      } else {
        /* Remove child elements in a memory-safe way. */
        while (this.firstElementChild) {
          this.firstElementChild.remove();
        }
        /* Remove any residual text nodes */
        this.innerHTML = "";
      }
      return this;
    }
  };
};

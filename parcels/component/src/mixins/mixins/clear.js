export default (parent, config) => {
  return class extends parent {
    static __name__ = "clear";
    /* Clears content, optionally subject to selector. Chainable. */
    clear(selector) {
      if (selector) {
        const elements = this.querySelectorAll(selector);
        for (const element of elements) {
          element.remove();
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

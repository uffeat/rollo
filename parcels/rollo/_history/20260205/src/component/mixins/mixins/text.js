export default (parent, config) => {
  return class extends parent {
    static __name__ = "text";
    /* Returns text content. */
    get text() {
      return this.textContent || null;
    }

    /* Sets text content. */
    set text(text) {
      this.textContent = text;
    }
  };
};

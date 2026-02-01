export default (parent, config) => {
  return class extends parent {
    static __name__ = "for_";
    /* Returns 'for' attribute. */
    get for_() {
      return this.getAttribute("for");
    }

    /* Sets 'for' attribute. */
    set for_(for_) {
      if (for_) {
        this.setAttribute("for", for_);
      } else {
        this.removeAttribute("for");
      }
    }

    bind(element) {
      element.id = element.uid
      this.setAttribute("for", element.id);
      return this

    }
  };
};

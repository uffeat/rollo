export default (parent, config) => {
  return class extends parent {
    static __name__ = "novalidation";
    /* Returns 'novalidation' attribute. */
    get novalidation() {
      return this.getAttribute("novalidation");
    }

    /* Sets 'novalidation' attribute. */
    set novalidation(novalidation) {
      if (novalidation) {
        this.setAttribute("novalidation", "");
      } else {
        this.removeAttribute("novalidation");
      }
    }
  };
};

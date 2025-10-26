export default (parent, config) => {
  return class extends parent {
    static __name__ = "tab";
    /* Returns tabindex. */
    get tab() {
      return this.getAttribute("tabindex");
    }

    /* Sets tabindex. */
    set tab(tab) {
      if ([false, null].includes(tab)) {
        this.removeAttribute("tabindex");
      } else {
        this.setAttribute("tabindex", tab);
      }
    }
  };
};

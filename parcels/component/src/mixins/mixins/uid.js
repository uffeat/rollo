let count = 0;

export default (parent, config) => {
  return class extends parent {
    static __name__ = "uid";

    __new__(...args) {
      super.__new__?.(...args);
      this.setAttribute("uid", `uid${count++}`);
    }

    /* Returns uid. */
    get uid() {
      return this.getAttribute("uid");
    }
  };
};

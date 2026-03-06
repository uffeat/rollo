let count = 0;

export default (parent, config) => {
  return class extends parent {
    static __name__ = "uid";

    __new__(...args) {
      super.__new__?.(...args);
      const uid = `uid${count++}`;
      this.setAttribute("uid", uid);
    }

    /* Returns uid. */
    get uid() {
      return this.getAttribute("uid");
    }
  };
};

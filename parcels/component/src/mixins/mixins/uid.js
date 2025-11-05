let count = 0;

export default (parent, config) => {
  return class extends parent {
    static __name__ = "uid";

    constructor() {
      super();
      this.setAttribute("uid", `uid${count++}`);
    }

    /* Returns uid. */
    get uid() {
      return this.getAttribute("uid");
    }
  };
};

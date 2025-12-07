export default (parent, config) => {
  return class extends parent {
    static __name__ = "detail";

    #_ = {
      detail: {},
    };

    /* Returns detail. */
    get detail() {
      return this.#_.detail;
    }
  };
};

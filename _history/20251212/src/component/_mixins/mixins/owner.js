export default (parent, config) => {
  return class extends parent {
    static __name__ = "owner";

    #_ = {};

    get owner() {
      return this.#_.owner;
    }

    set owner(owner) {
      this.#_.owner = owner;
      if (this.attribute) {
        this.attribute = owner && "uid" in owner ? owner.uid : owner;
      }
    }
  };
};

export default (parent, config, ...mixins) => {
  return class extends parent {
    static __name__ = "super_";

    #_ = {}

    __new__() {
      super.__new__?.();

      const _get = (key) => {
        return super[key];
      };

      const _set = (key, value) => {
        super[key] = value;
      };

      this.#_.super_ = new Proxy(this, {
        get(target, key) {
          return _get(key);
        },
        set(target, key, value) {
          _set(key, value);
          return true;
        },
      });
    }

    /* Returns object, from which super items can be retrived/set. */
    get super_() {
      return this.#_.super_
    }
  };
};
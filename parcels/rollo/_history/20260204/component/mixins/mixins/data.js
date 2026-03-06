const START = "data.".length;

export default (parent, config) => {
  return class extends parent {
    static __name__ = "data";

    #_ = {};

    constructor() {
      super();
      this.#_.data = new Proxy(this, {
        get(target, name) {
          return target.attributes.get(`data-${name}`);
        },
        set(target, name, value) {
          target.attributes.set(`data-${name}`, value);
          return true;
        },
      });
    }

    /* Provides access to single data attribute without use of strings. */
    get data() {
      return this.#_.data;
    }

    /* Updates attributes from 'data.'-syntax. */
    update(updates = {}) {
      super.update?.(updates);
      this.attributes.update(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith("data."))
            .map(([k, v]) => {
              const name = `data-${k.slice(START)}`;
              return [name, v];
            })
        )
      );
      return this;
    }
  };
};

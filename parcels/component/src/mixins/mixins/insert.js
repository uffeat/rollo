class Insert {
  #_ = {};

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Inserts elements/html fragments 'afterbegin'. Chainable with respect to component. */
  afterbegin(...elements) {
    elements.reverse().forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("afterbegin", e);
    });
    return this.#_.owner;
  }
  /* Inserts elements/html fragments 'afterend'. Chainable with respect to component. */
  afterend(...elements) {
    elements.reverse().forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("afterend", e);
    });

    return this.#_.owner;
  }
  /* Inserts elements/html fragments 'beforebegin'. Chainable with respect to component. */
  beforebegin(...elements) {
    elements.forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("beforebegin", e);
    });
    return this.#_.owner;
  }
  /* Inserts  elements/html fragments 'beforeend'. Chainable with respect to component. */
  beforeend(...elements) {
    elements.forEach((e) => {
      e &&
        this.#_.owner[
          typeof e === "string" ? "insertAdjacentHTML" : "insertAdjacentElement"
        ]("beforeend", e);
    });
    return this.#_.owner;
  }
}

export default (parent, config, ...mixins) => {
  return class extends parent {
    static __name__ = "insert";
    #_ = {};

    __new__() {
      super.__new__?.();
      this.#_.insert = new Insert(this);
    }

    /* Inserts elements. 
    Syntactical alternative to insertAdjacentElement with a leaner syntax and 
    ability to handle multiple elements. */
    get insert() {
      return this.#_.insert;
    }
  };
};

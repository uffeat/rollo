export default (parent, config) => {
  return class extends parent {
    static __name__ = "append";

    /* Appends children. Chainable. */
    append(...children) {
      if (Array.isArray(children.at(0))) {
        super.append(...children.at(0));
      } else {
        super.append(...children);
      }
      return this;
    }

    /* Prepends children. Chainable. */
    prepend(...children) {
      super.prepend(...children);
      return this;
    }
  };
};

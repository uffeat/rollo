export default (parent, config) => {
  return class extends parent {
    static __name__ = "vars";
    #_ = {};
    constructor() {
      super();

      this.#_.__ = new Proxy(this, {
        get(target, name) {
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }
          /* By convention, false signals absence of CSS var */
          if (target.isConnected) {
            const value = getComputedStyle(target)
              .getPropertyValue(name)
              .trim();
            if (!value) return false;
            const priority = target.style.getPropertyPriority(name);
            if (priority) return `${value} !${priority}`;
            if (value === "none") return null;
            return value;
          }

          const value = target.style.getPropertyValue(name);
          if (!value) return false;
          const priority = target.style.getPropertyPriority(name);
          if (priority) return `${value} !${priority}`;
          if (value === "none") return null;
          return value;
        },
        set(target, name, value) {
          /* Normalize name */
          if (!name.startsWith("--")) {
            name = `--${name}`;
          }
          /* Interpret value as per conventions */
          if (value === null) {
            value = "none";
          } else if (value === 0) {
            value = "0";
          } else if (typeof value === "number") {
            value = `${value}rem`;
          }
          /* Abort, if undefined/'...' value, e.g., for efficient use of iife's */
          if (value === undefined || value === "...") {
            return true;
          }
          /* Abort, if no change */
          const current = target.__[name];
          if (value === current) {
            return true;
          }
          /* Update */
          if (value === false) {
            /* By convention, false removes */
            target.style.removeProperty(name);
          } else {
            if (typeof value === "string") {
              value = value.trim();
              /* Handle priority */
              if (value.endsWith("!important")) {
                target.style.setProperty(
                  name,
                  value.slice(0, -"!important".length),
                  "important"
                );
              } else {
                target.style.setProperty(name, value);
              }
            } else {
              target.style.setProperty(name, value);
            }
          }
          return true;
        },
      });
    }

    /* Provides access to single CSS var without use of strings. */
    get __() {
      return this.#_.__;
    }

    /* Updates CSS vars from '__'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      for (let [key, value] of Object.entries(updates)) {
        /* Ignore dunder keys */
        if (key.endsWith("__")) {
          continue;
        }
        /* Ignore, if not special syntax */
        if (!key.startsWith("__")) {
          continue;
        }

        /* Update */
        this.__[key.slice("__".length)] = value;
      }

      return this;
    }
  };
};

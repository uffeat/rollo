export default (parent, config) => {
  return class extends parent {
    static __name__ = "classes";
    #_ = {};
    constructor() {
      super();
      const owner = this;
      this.#_.classes = new (class {
        /* Returns classList (for advanced use). */
        get list() {
          return owner.classList;
        }

        /* Adds classes. */
        add(...args) {
          for (const arg of args) {
            if (arg) {
              if (arg.includes(" ")) {
                owner.classList.add(
                  ...arg
                    .split(" ")
                    .map((v) => v.trim())
                    .filter((v) => !!v)
                );
              } else {
                owner.classList.add(...arg.split("."));
              }
            }
          }

          return owner;
        }

        /* Removes all classes. */
        clear() {
          for (const c of Array.from(owner.classList)) {
            owner.classList.remove(c);
          }
          return owner;
        }

        /* Checks, if classes are present. */
        has(classes) {
          for (const c of classes.split(".")) {
            if (!owner.classList.contains(c)) {
              return false;
            }
          }
          return true;
        }

        /* Adds/removes classes according to condition. */
        if(condition, classes) {
          this[!!condition ? "add" : "remove"](classes);
          return owner;
        }

        /* Removes classes. */
        remove(classes) {
          classes && owner.classList.remove(...classes.split("."));
          return owner;
        }

        /* Replaces classes with substitutes. 
        NOTE
        - If mismatch between 'classes' and 'substitutes' sizes are (intentionally) 
        silently ignored. */
        replace(classes, substitutes) {
          classes = classes.split(".");
          substitutes = substitutes.split(".");
          for (let i = 0; i < classes.length; i++) {
            const substitute = substitutes.at(i);
            if (substitute === undefined) {
              break;
            } else {
              owner.classList.replace(classes[i], substitute);
            }
          }
          return owner;
        }

        /* Toggles classes. */
        toggle(classes, force) {
          for (const c of classes.split(".")) {
            owner.classList.toggle(c, force);
          }
          return owner;
        }
      })();
    }

    /* Returns controller for managing CSS classes from '.'-separated strings. */
    get classes() {
      return this.#_.classes;
    }

    /* Updates CSS classes from '.'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);

      for (const [key, value] of Object.entries(updates)) {
        /* Ignore, if not special syntax */
        if (!key.startsWith(".")) {
          continue;
        }
        /* Ignore undefined/'...' values, e.g., for efficient use of iife's.
        NOTE '...' is used as a proxy for undefined to enable use from Python, 
        which does not support undefined */
        if (value === undefined || value === "...") {
          continue;
        }
        /* Adjust for special syntax and update */
        this.classes[value ? "add" : "remove"](key.slice(".".length));
      }
      return this;
    }
  };
};

/* TODO
- If ever needed: Relatively easy to make classes reactive, by event dispatch. */

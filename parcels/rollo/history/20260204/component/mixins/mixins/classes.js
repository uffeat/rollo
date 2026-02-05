class Classes {
  #_ = {};
  constructor(owner) {
    this.#_.owner = owner;
  }

  get owner() {
    return this.#_.owner;
  }

  get size() {
    return this.owner.classList.length;
  }

  /* Adds classes. */
  add(arg) {
    const values = this.#toArray(arg);
    this.owner.classList.add(...values);
    return this.owner;
  }

  /* Removes all classes. */
  clear() {
    for (const value of Array.from(owner.classList)) {
      this.owner.classList.remove(value);
    }
    this.owner.removeAttribute("class");
    return this.owner;
  }

  /* Checks, if classes are present. */
  has(arg) {
    const values = this.#toArray(arg);
    for (const value of values) {
      if (!this.owner.classList.contains(value)) {
        return false;
      }
    }
    return true;
  }

  /* Adds/removes classes according to condition. */
  if(condition, classes) {
    this[!!condition ? "add" : "remove"](classes);
    return this.owner;
  }

  /* Removes classes. */
  remove(arg) {
    const values = this.#toArray(arg);
    this.owner.classList.remove(...values);
    if (!this.size) {
      this.owner.removeAttribute("class");
    }
    return this.owner;
  }

  /* Replaces current with substitutes. 
  NOTE
  - If mismatch between 'current' and 'substitutes' sizes, substitutes are (intentionally) 
  silently ignored. */
  replace(current, substitutes) {
    current = this.#toArray(current);
    substitutes = this.#toArray(substitutes);
    for (let i = 0; i < current.length; i++) {
      const substitute = substitutes.at(i);
      if (!substitute) {
        break;
      } else {
        this.owner.classList.replace(current[i], substitute);
      }
    }
    return this.owner;
  }

  /* Toggles classes. */
  toggle(arg, force) {
    const values = this.#toArray(arg);
    for (const value of values) {
      this.owner.classList.toggle(value, force);
    }
    return this.owner;
  }

  #toArray(arg) {
    if (arg) {
      const sep = arg.includes(".") ? "." : " ";
      return arg
        .split(sep)
        .map((v) => v.trim())
        .filter((v) => !!v);
    }
    return [];
  }
}

export default (parent, config) => {
  return class extends parent {
    static __name__ = "classes";
    #_ = {};
    constructor() {
      super();
      const owner = this;

      this.#_.classes = new Classes(this);

      /* Lean DX for adding/removing classes */
      this.#_.class = new Proxy(() => {}, {
        get(_, key) {
          owner.classes.add(key);
        },
        set(_, key, value) {
          owner.classes[value ? "add" : "remove"](key);
          return true;
        },
        apply(_, thisArg, args) {
          console.error("Not yet implemented.");
        },
      });
    }

    get class() {
      return this.#_.class;
    }

    /* Returns controller for managing CSS classes from a string.
    The string can be '.'- or ' '-separated. For Tailwind detection, use ' '
    -separation. To escape Tailwind detection, use '.'-separation, incl.
    leading '.'.
     */
    get classes() {
      return this.#_.classes;
    }

    /* Updates CSS classes from '.'-syntax. */
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
        this.classes[value ? "add" : "remove"](key);
      }
      return this;
    }
  };
};

import "../../../use.js";

const { camelToKebab } = await use("@/tools/case");

export default (parent, config) => {
  return class extends parent {
    static __name__ = "attrs";
    #_ = {};
    constructor() {
      super();

      const owner = this;

      const _attributes = super.attributes;
      this.#_.attributes = new (class Attributes {
        
        /* Returns attributes NamedNodeMap (for advanced use). */
        get attributes() {
          return _attributes;
        }

        get owner() {
          return owner;
        }

        /* Returns number of set attributes. */
        get size() {
          return _attributes.length;
        }

        /* Returns attribute entries. */
        entries() {
          return Array.from(_attributes, (item) => [
            item.name,
            this.#interpret(item.value),
          ]);
        }

        /* Returns attribute value. */
        get(name) {
          name = camelToKebab(name);
          /* By convention, non-present attrs are interpreted as null */
          if (!owner.hasAttribute(name)) {
            return null;
          }
          const value = owner.getAttribute(name);
          return this.#interpret(value);
        }

        /* Checks, if attribute set. */
        has(name) {
          name = camelToKebab(name);
          return owner.hasAttribute(name);
        }

        /* Returns attribute keys (names). */
        keys() {
          return Array.from(_attributes, (item) => item.name);
        }

        /* Sets one or more attribute values. Chainable with respect to component. */
        set(name, value) {
          /* Normalize name */
          name = camelToKebab(name);
          /* Abort, if undefined'...', e.g., for efficient use of iife's.
          NOTE '...' is used as a proxy for undefined to enable use from Python, 
          which does not support undefined */
          if (value === undefined || value === "...") {
            return owner;
          }
          /* Abort, if no change */
          const previous = this.#interpret(owner.getAttribute(name));
          if (value === previous) {
            return owner;
          }
          /* Update */
          if ([false, null].includes(value)) {
            /* By convention, false and null removes */
            owner.removeAttribute(name);
          } else if (
            value === true ||
            !["number", "string"].includes(typeof value)
          ) {
            /* By convention, non-primitive values sets value-less attribute */
            owner.setAttribute(name, "");
          } else {
            owner.setAttribute(name, value);
          }
          owner.dispatchEvent(
            new CustomEvent("_attributes", {
              detail: Object.freeze({ name, current: value, previous }),
            })
          );
          return owner;
        }

        /* Updates one or more attribute values. Chainable with respect to component. */
        update(updates = {}) {
          Object.entries(updates).forEach(([name, value]) => {
            this.set(name, value);
          });
          return owner;
        }

        /* Returns attribute values (interpreted). */
        values() {
          return Array.from(_attributes, (item) => item.value);
        }

        #interpret(value) {
          /* By convention, value-less attributes are interpreted as true */
          if (value === "") {
            return true;
          }
          /* By convention, values that can be interpreted as numbers are 
          interpreted as numbers */
          if (value === null) {
            /* null converts to 0, therefore treat as special case */
            return value;
          }
          const number = Number(value);
          return isNaN(number) ? value || true : number;
        }
      })();

      this.#_.attribute = new Proxy(this, {
        get(target, name) {
          return target.attributes.get(name);
        },
        set(target, name, value) {
          target.attributes.set(name, value);
          return true;
        },
      });
    }

    attributeChangedCallback(name, previous, current) {
      super.attributeChangedCallback?.(name, previous, current);
      this.dispatchEvent(
        new CustomEvent("_attribute", { detail: Object.freeze({ name, previous, current }) })
      );
    }

    /* Provides access to single attribute without use of strings. */
    get attribute() {
      return this.#_.attribute;
    }

    /* Return attributes controller. */
    get attributes() {
      return this.#_.attributes;
    }

    /* Updates attributes from '[]'-syntax. Chainable. */
    update(updates = {}) {
      super.update?.(updates);
      this.attributes.update(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith("[") && k.endsWith("]"))
            .map(([k, v]) => [k.slice("[".length, -"]".length), v])
        )
      );
      return this;
    }
  };
};

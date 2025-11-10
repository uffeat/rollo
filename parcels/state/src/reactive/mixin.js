import { Reactive } from "./reactive.js";

const $ = "$";
const START = $.length;

export default (parent) => {
  return class extends parent {
    static __name__ = "reactive";

    #_ = {};

    constructor() {
      super();
      this.#_.state = Reactive.create({ owner: this });
      
      this.#_.state.effects.add(
        (change, message) => {
          /* state -> component natives */
          this.update(change);

          const attributeUpdates = Object.fromEntries(
            Object.entries(change).filter(([k, v]) => {
              return (
                !(k in this && !k.startsWith("_")) &&
                !(k in this.style) &&
                !k.startsWith("[") &&
                !k.startsWith(".") &&
                !k.startsWith("__") &&
                !k.startsWith("@")
              );
            }).map(([k, v]) => [`state-${k}`, v])
          );
          this.attributes.update(attributeUpdates)
        },
        { run: false }
      );

      
    }

    get $() {
      return this.#_.state.$;
    }

    get effects() {
      return this.#_.state.effects;
    }

    get name() {
      return this.attribute.name;
    }

    set name(name) {
      this.attribute.name = name;
    }

    get owner() {
      return this.#_.owner;
    }

    set owner(owner) {
      if (owner) {
        this.attribute.owner = owner.uid ? owner.uid : true;
      }
      this.#_.owner = owner;
    }

    get state() {
      return this.#_.state;
    }

    update(updates = {}) {
      super.update?.(updates);

      this.$(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith($))
            .map(([k, v]) => [k.slice(START), v])
        )
      );

      return this;
    }
  };
};

import { Reactive } from "./reactive";

const $ = "$";
const START = $.length;

export default (parent) => {
  return class extends parent {
    static __name__ = "reactive";

    #_ = {};

    constructor() {
      super();
      this.#_.state = Reactive.create({}, { owner: this });

      this.#_.state.effects.add(
        (change, message) => {
          /* Update component natives from state */
          this.update(change);
          /* Update component attributes from state items that do not 
          correspond to component natives */
          const updates = Object.fromEntries(
            Object.entries(change)
              .filter(([k, v]) => {
                return (
                  !(k in this && !k.startsWith("_")) &&
                  !(k in this.style) &&
                  !k.startsWith("[") &&
                  !k.startsWith("data.") &&
                  !k.startsWith(".") &&
                  !k.startsWith("__") &&
                  !k.startsWith("on.")
                );
              })
              .map(([k, v]) => {
                if (k.startsWith("state")) {
                  return [`${k}`, v];
                }
                return [`state-${k}`, v];
              }),
          );
          this.attributes.update(updates);
        },
        { run: false },
      );
    }

    get $() {
      return this.#_.state.$;
    }

    get effects() {
      return this.#_.state.effects;
    }

    get state() {
      return this.#_.state;
    }

    update(updates = {}) {
      super.update?.(updates);
      /* Reactively update component natives prefixed with '$' */
      this.$(
        Object.fromEntries(
          Object.entries(updates)
            .filter(([k, v]) => k.startsWith($))
            .map(([k, v]) => [k.slice(START), v]),
        ),
      );
      return this;
    }
  };
};

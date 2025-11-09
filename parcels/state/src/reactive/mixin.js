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
          
          this.update(change);

          

          //this.send("_state", { detail: Object.freeze({ change, message }) });
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
  };
};

import { Ref } from "./ref.js";

export default (parent) => {
  return class extends parent {
    static __name__ = "ref";

    #_ = {};

    constructor() {
      super();
      this.#_.ref = Ref.create({ owner: this });
      this.#_.ref.effects.add(
        (current, message) => {
          this.attribute.current = current;
          this.attribute.previous = this.previous;
          this.attribute.session = this.session;
          this.send("_ref", { detail: Object.freeze({ current, message }) });
        },
        { run: false }
      );
    }

    get current() {
      return this.#_.ref.current;
    }

    set current(current) {
      this.#_.ref.update(current);
    }

    get effects() {
      return this.#_.ref.effects;
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

    get previous() {
      return this.#_.ref.previous;
    }

    get ref() {
      return this.#_.ref;
    }

    get session() {
      return this.#_.ref.session;
    }
  };
};

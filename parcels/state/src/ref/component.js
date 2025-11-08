import { Ref } from "./ref.js";

const Exception = await use("Exception");
const { author, component, mix, mixins } = await use("@/component.js");

/*. */
export const RefComponent = author(
  class extends mix(
    HTMLElement,
    {},
    mixins.append,
    mixins.attrs,
    mixins.classes,
    mixins.clear,
    mixins.connect,
    mixins.detail,
    mixins.find,
    mixins.handlers,
    mixins.insert,
    mixins.parent,
    mixins.props,
    mixins.send,
    mixins.style,
    mixins.text,
    mixins.uid,
    mixins.vars,
  ) {
    #_ = {};
    constructor() {
      super();
      this.#_.ref = Ref.create({ owner: this });
      this.#_.ref.effects.add(
        (current, message) => {
          //console.log('Effect that syncs to attrs got current:', current)////
          this.attribute.current = current;
          this.attribute.previous = this.previous;
          this.attribute.session = this.session;
        
          this.send("change", { detail: { current, message } });
        },
        { run: false }
      );
    }

    __init__(...args) {
      super.__init__?.(...args);
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
  },
  "ref-component"
);

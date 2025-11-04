import { Ref } from "./ref.js";

const Exception = await use("exception.js");

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
    mixins.vars
  ) {
    #_ = {};
    constructor() {
      super();
      this.#_.ref = Ref.create();
      this.#_.ref.effects.add(
        (value, message) => {
          this.attribute.current = value;
          this.attribute.current = message.owner.previous;
        },
        { run: false }
      );
    }

    get config() {
      return this.#_.ref.config;
    }

    get current() {
      return this.#_.ref.current;
    }

    set current(value) {
      this.#_.ref.update(value);
    }

    get effects() {
      return this.#_.ref.effects;
    }

    get name() {
      return this.#_.ref.name;
    }

    set name(name) {
      this.#_.ref.name = name;
    }

    get owner() {
      return this.#_.ref.owner;
    }

    set owner(owner) {
      this.#_.ref.owner = owner;
    }

    get previous() {
      return this.#_.ref.previous;
    }

    get session() {
      return this.#_.ref.session;
    }
  },
  "ref-component"
);

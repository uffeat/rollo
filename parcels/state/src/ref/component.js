import { Ref } from "./ref.js";

const Exception = await use("exception.js");
const { author, component, mix, mixins } = await use("@/component.js");
const { typeName } = await use("@/tools/types.js");

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
      this.#_.ref = Ref.create({ owner: this });
      this.#_.ref.effects.add(
        (current, message) => {
          if (typeName(current) === "Object" || Array.isArray(current)) {
            try {
              current = JSON.stringify(current);
            } catch {}
          }
          this.attribute.current = current;

          let previous = message.owner.previous;
          if (typeName(previous) === "Object" || Array.isArray(previous)) {
            try {
              previous = JSON.stringify(previous);
            } catch {}
          }
          this.attribute.previous = previous;

          this.attribute.session = this.session;

          this.attribute.efects = message.owner.effects.size;

          this.send('change', {detail: {}})
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
      return this.attribute.name;
    }

    set name(name) {
      Exception.if(this.attribute.name !== null, `Cannot change 'name'.`);
      this.attribute.name = name;
    }

    get owner() {
      return this.#_.owner;
    }

    set owner(owner) {
      Exception.if(this.#_.owner !== undefined, `Cannot change 'owner'.`);
      this.#_.owner = owner;
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

import "../use";
const { Mixins, author, component, mix, stateMixin } = await use("@/rollo/");

export const Input = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {
      tree: {},
    };
    constructor() {
      super();
    }

    __new__(...args) {
      super.__new__?.(...args);
      /** Build tree */
      this.tree.floating = component.div("form-floating", { parent: this });
      this.tree.input = component.input("form-control", {
        /* Enable Bootstrap float */
        placeholder: " ",
        /* Prevent browser default error title */
        title: " ",
      });
      this.tree.label = component.label().bind(this.tree.input);
      this.tree.floating.append(this.tree.input, this.tree.label);
      this.tree.message = component.div(".form-text", { parent: this });
      Object.freeze(this.tree);
      /* blur -> visited state. Also validates. */
      this.tree.input.on.blur({ once: true }, (event) => {
        this.attribute.visited = true;
        this.validate();
      });

      /* input -> value state */
      this.tree.input.on.input((event) => {
        this.$.value = this.tree.input.value;
      });
      /* value state -> displayed value and value attr. Also validates. */
      this.$.effects.add(
        ({ value }, message) => {
          this.tree.input.value = value;
          this.attribute.value = value ? value : null;
          this.validate();
        },
        ["value"],
      );
    }

    get label() {
      return this.tree.label.text;
    }

    set label(label) {
      this.tree.label.text = label;
    }

    get name() {
      return this.tree.input.name;
    }

    set name(name) {
      this.attribute.name = name;
      this.tree.input.name = name;
    }

    get required() {
      return this.tree.input.required;
    }

    set required(required) {
      this.text = 'Required'
      this.tree.input.required = required;
    }

    get text() {
      return this.tree.message.text;
    }

    set text(text) {
      this.tree.message.text = text;
    }

    get tree() {
      return this.#_.tree;
    }

    get type() {
      return this.tree.input.type;
    }

    set type(type) {
      this.tree.input.type = type;
    }

    get value() {
      return this.$.value;
    }

    set value(value) {
      this.$.value = value;
    }

    validate() {
      const valid = this.tree.input.checkValidity();

      this.tree.message.text = valid ? null : 'Required'

      if (this.attribute.visited) {
        this.tree.input.classes.if(!valid, "is-invalid");

        
      }

      return valid;
    }
  },
  "input-component",
);

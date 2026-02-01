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

      this.tree.floating = component.div("form-floating", { parent: this });

      this.tree.input = component.input("form-control", {
        /* Enable Bootstrap float */
        placeholder: " ",
        /* Prevent browser default error title */
        title: " ",
      });
      this.tree.input.id = this.tree.input.uid;

      this.tree.label = component.label({
        for_: this.tree.input.id,
      });

      this.tree.floating.append(this.tree.input, this.tree.label);

      this.tree.message = component.div(".form-text", { parent: this });
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
      this.tree.input.name = name;
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
      return this.tree.input.value.trim();
    }

    set value(value) {
      this.tree.input.value = value;
    }

    validate() {
      const valid = this.tree.input.checkValidity();
      console.log("valid:", valid); ////

      this.tree.input.classes.if(!valid, "is-invalid");

      if (valid) {
        //this.tree.input
      } else {
      }
    }
  },
  "input-component",
);

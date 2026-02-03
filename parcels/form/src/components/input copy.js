import "../../use";
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
      this.attribute.formControl = true;
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
        this.$.visited = true;
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

    __init__(...args) {
      super.__init__?.(...args);
      /* Defaults */
      if (!this.attribute.type) {
        this.type = "text";
      }

      this.validate();
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
      this.text = required ? "Required" : null;
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
      this.attribute.type = type;
      this.tree.input.type = type;
    }

    get valid() {
      return this.$.valid;
    }

    get value() {
      return this.$.value;
    }

    set value(value) {
      this.$.value = value;
    }

    validate() {
      const valid = this.tree.input.checkValidity();
      /* Make valid reactive and show as state attr */
      this.$.valid = valid;
      /* Set message */
      const validity = this.tree.input.validity;
      this.tree.message.text = null;
      if (validity.valueMissing) {
        this.tree.message.text = "Required";
      } else {
        if (this.$.visited) {
          if (validity.typeMismatch) {
            this.tree.message.text = "Invalid format";
          } else if (validity.patternMismatch) {
            this.tree.message.text = "Invalid format";
          } else if (validity.tooLong) {
            this.tree.message.text = "Too long";
          } else if (validity.tooShort) {
            this.tree.message.text = "Too short";
          } else if (validity.rangeOverflow) {
            this.tree.message.text = "Too high";
          } else if (validity.rangeUnderflow) {
            this.tree.message.text = "Too low";
          } else if (validity.customError) {
            this.tree.message.text = this.tree.input.validationMessage;
          } else {
            if (!valid) {
              this.tree.message.text = "Invalid";
            }
          }
        }
      }
      /* Style input */
      this.tree.input.classes.if(!valid && this.$.visited, "is-invalid");
      /* Trigger form-level validation; sets reative 'valid' state on form. */
      this.parent?.validate();

      return valid;
    }
  },
  "input-component",
);

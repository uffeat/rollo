import "../../use";

const { Mixins, author, component, css, html, mix, stateMixin } =
  await use("@/rollo/");
const bootstrap = await use("@/bootstrap/bootstrap.css");

export const Input = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {
      tree: {},
    };
    constructor() {
      super();
      /* Build shadow 
      NOTE Use shadow component as a "proxy" for shadowRoot to get component 
      features that the native shadowRoot does not have.*/
      this.#_.shadow = component.from(html`
        <!--NOTE Dark mode ported to shadow-->
        <div id="root" class="input-group" data-bs-theme="dark">
          <div class="form-floating">
            <input class="form-control" placeholder=" " title=" " />
            <label></label>
            <div class="form-text"></div>
          </div>
        </div>
      `);
      this.attachShadow({ mode: "open" }).append(this.shadow);
      /* Adopting the full Bootstrap sheet to shadow may at first glance seem 
      inefficent, but is actually fast and works smoothly. */
      bootstrap.use(this);
      css`
        #root {
          width: 100%;
        }
        /* Change Bootstrap default placement of message. */
        .form-text {
          padding-left: 0.75rem;
        }
        /* Style message for invalid input. */
        :host([state-visited]:not([state-valid])) .form-text {
          color: var(--bs-form-invalid-color);
        }
        /* Ensure that empty messages have the same height as non-empty 
        messages to avoid vertical shifts. */
        .form-text:empty::after {
          content: "x";
          visibility: hidden;
        }
        /* Change Bootstrap default placement of label in high-position. */
        #root:not(:has(input:placeholder-shown)) label,
        #root:has(input:placeholder-shown:focus) label {
          top: -4px !important;
        }
      `.use(this);
    }

    __new__(...args) {
      super.__new__?.(...args);
      /* Set common form-control attr for light-dom styling. */
      this.attribute.formControl = true;
      /* Create tree 
      NOTE 
      - Would have been slightly more efficient to create and inject tree 
        components rather than building from html and then extracting. However,
        buidling the tree from html provides clarity. 
      - Exposing 'tree' seems to break encapsulation. However, the tree is 
        frozen and the "encapsulation" is pseudo anyway - and exposure
        provides a backdoor for special cases. */
      this.tree.floating = this.shadow.querySelector(".form-floating");
      this.tree.input = this.shadow.querySelector(".form-control");
      this.tree.label = this.shadow
        .querySelector("label")
        .bind(this.tree.input);
      this.tree.message = this.shadow.querySelector(".form-text");
      Object.freeze(this.tree);
      /* Blur event -> visited state + validate. */
      this.tree.input.on.blur({ once: true }, (event) => {
        this.$.visited = true;
        this.validate();
      });
      /* Input event -> value state */
      this.tree.input.on.input((event) => {
        this.$.value = this.tree.input.value;
      });
      /* Value state -> displayed value + value attr + validate. */
      this.$.effects.add(
        ({ value }, message) => {
          this.tree.input.value = value;
          this.attribute.value = value ? value : null;
          this.validate();
        },
        ["value"],
      );
    }

    /* Sets defaults and validates */
    __init__(...args) {
      super.__init__?.(...args);
      /* Defaults */
      if (!this.attribute.type) {
        this.type = "text";
      }
      this.validate();
    }

    /* Returns label text. */
    get label() {
      return this.tree.label.text;
    }

    /* Sets label text. */
    set label(label) {
      this.tree.label.text = label;
    }

    /* Returns name. */
    get name() {
      return this.tree.input.name;
    }

    /* Sets name. */
    set name(name) {
      /* Reflect prop onto host component to enable parsing of form data 
      without diving into the shadow. */
      this.attribute.name = name;
      this.tree.input.name = name;
    }

    /* Returns required flag. */
    get required() {
      return this.tree.input.required;
    }

    /* Sets required flag. */
    set required(required) {
      this.text = required ? "Required" : null;
      this.tree.input.required = required;
    }

    /* Returns shadow component (shadowRoot "proxy"). */
    get shadow() {
      return this.#_.shadow;
    }

    /* Returns message text. */
    get text() {
      return this.tree.message.text || null;
    }

    /* Sets message text. */
    set text(text) {
      this.tree.message.text = text;
    }

    /* Returns tree. */
    get tree() {
      return this.#_.tree;
    }

    /* Returns input type. */
    get type() {
      return this.tree.input.type;
    }

    /* Sets input type. */
    set type(type) {
      /* Reflect prop onto host component to enable parsing of form data 
      without diving into the shadow. */
      this.attribute.type = type;
      this.tree.input.type = type;
    }

    /* Returns valid state. */
    get valid() {
      return this.$.valid;
    }

    /* Returns value state. */
    get value() {
      return this.$.value;
    }

    /* Sets value state. */
    set value(value) {
      this.$.value = value;
    }

    /* Validates input, sets message and reports to parent form. */
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
      /* Trigger form-level validation; sets reative valid state on form. */
      this.parent?.validate();

      return valid;
    }
  },
  "input-component",
);

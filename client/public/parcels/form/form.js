const { Mixins: i, author: r, mix: o, stateMixin: a } = await use("@/rollo/"), s = "form", v = r(
  class extends o(
    document.createElement(s).constructor,
    {},
    ...i(a)
  ) {
    #t = {};
    constructor() {
      super();
    }
    __new__(...t) {
      super.__new__?.(...t), this.attribute[this.constructor.__key__] = !0, this.attribute.webComponent = !0, this.noValidate = !0;
    }
    get controls() {
      return Array.from(this.children).filter((e) => e.attribute.formControl);
    }
    get data() {
      const t = {};
      for (const e of this.controls)
        t[e.name] = e.value;
      return t;
    }
    get valid() {
      return this.$.valid;
    }
    validate() {
      for (const t of this.controls)
        if (!t.valid)
          return this.$.valid = !1, !1;
      return this.$.valid = !0, !0;
    }
  },
  "form-component",
  s
), { Mixins: n, author: l, component: h, css: u, html: d, mix: c, stateMixin: m } = await use("@/rollo/"), p = await use("@/bootstrap/bootstrap.css"), g = l(
  class extends c(HTMLElement, {}, ...n(m)) {
    #t = {
      tree: {}
    };
    constructor() {
      super(), this.#t.shadow = h.from(d`
        <!--NOTE Dark mode ported to shadow-->
        <div id="root" class="input-group" data-bs-theme="dark">
          <div class="form-floating">
            <input class="form-control" placeholder=" " title=" " />
            <label></label>
            <div class="form-text"></div>
          </div>
        </div>
      `), this.attachShadow({ mode: "open" }).append(this.shadow), p.use(this), u`
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
    __new__(...t) {
      super.__new__?.(...t), this.attribute.formControl = !0, this.tree.floating = this.shadow.querySelector(".form-floating"), this.tree.input = this.shadow.querySelector(".form-control"), this.tree.label = this.shadow.querySelector("label").bind(this.tree.input), this.tree.message = this.shadow.querySelector(".form-text"), Object.freeze(this.tree), this.tree.input.on.blur({ once: !0 }, (e) => {
        this.$.visited = !0, this.validate();
      }), this.tree.input.on.input((e) => {
        this.$.value = this.tree.input.value;
      }), this.$.effects.add(
        ({ value: e }, f) => {
          this.tree.input.value = e, this.attribute.value = e || null, this.validate();
        },
        ["value"]
      );
    }
    /* Sets defaults and validates */
    __init__(...t) {
      super.__init__?.(...t), this.attribute.type || (this.type = "text"), this.validate();
    }
    /* Returns label text. */
    get label() {
      return this.tree.label.text;
    }
    /* Sets label text. */
    set label(t) {
      this.tree.label.text = t;
    }
    /* Returns name. */
    get name() {
      return this.tree.input.name;
    }
    /* Sets name. */
    set name(t) {
      this.attribute.name = t, this.tree.input.name = t;
    }
    /* Returns required flag. */
    get required() {
      return this.tree.input.required;
    }
    /* Sets required flag. */
    set required(t) {
      this.text = t ? "Required" : null, this.tree.input.required = t;
    }
    /* Returns shadow component (shadowRoot "proxy"). */
    get shadow() {
      return this.#t.shadow;
    }
    /* Returns message text. */
    get text() {
      return this.tree.message.text || null;
    }
    /* Sets message text. */
    set text(t) {
      this.tree.message.text = t;
    }
    /* Returns tree. */
    get tree() {
      return this.#t.tree;
    }
    /* Returns input type. */
    get type() {
      return this.tree.input.type;
    }
    /* Sets input type. */
    set type(t) {
      this.attribute.type = t, this.tree.input.type = t;
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
    set value(t) {
      this.$.value = t;
    }
    /* Validates input, sets message and reports to parent form. */
    validate() {
      const t = this.tree.input.checkValidity();
      this.$.valid = t;
      const e = this.tree.input.validity;
      return this.tree.message.text = null, e.valueMissing ? this.tree.message.text = "Required" : this.$.visited && (e.typeMismatch ? this.tree.message.text = "Invalid format" : e.patternMismatch ? this.tree.message.text = "Invalid format" : e.tooLong ? this.tree.message.text = "Too long" : e.tooShort ? this.tree.message.text = "Too short" : e.rangeOverflow ? this.tree.message.text = "Too high" : e.rangeUnderflow ? this.tree.message.text = "Too low" : e.customError ? this.tree.message.text = this.tree.input.validationMessage : t || (this.tree.message.text = "Invalid")), this.tree.input.classes.if(!t && this.$.visited, "is-invalid"), this.parent?.validate(), t;
    }
  },
  "input-component"
);
export {
  v as Form,
  g as Input
};

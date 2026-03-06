import { type } from "../tools/type";
import { Rules } from "./rules";
import { Targets } from "./targets";

/* CSSStyleSheet extension with controlled adoption and light-weight dynamic 
rule control. */
export class Sheet extends CSSStyleSheet {
  static create = (...args) => new Sheet(...args);

  #_ = {
    detail: {},
  };

  constructor(...args) {
    super();
    /* Compose */
    this.#_.rules = Rules.create(this);
    this.#_.targets = Targets.create(this);
    /* Parse args */
    this.#_.text = args.find((a, i) => !i && typeof a === "string");
    this.#_.path = args.find((a, i) => i && typeof a === "string");
    const rules = args.find((a) => type(a) === "Object");
    const detail = args.find((a) => type(a) === "Object" && a !== rules);
    /* Use args */
    if (this.text) this.replaceSync(this.text);
    if (rules) this.rules.add(rules);
    Object.assign(this.detail, detail);
  }

  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns path (if provided). Useful for soft identification. */
  get path() {
    return this.#_.path;
  }

  get rules() {
    return this.#_.rules;
  }

  /* Returns targets controller. */
  get targets() {
    return this.#_.targets;
  }

  /* Returns text representation of original sheet. */
  get text() {
    return this.#_.text;
  }

  disable() {
    this.disabled = true;
    return this;
  }

  enable() {
    this.disabled = false;
    return this;
  }

  /* Unadopts sheet from targets. */
  unuse(...targets) {
    if (!targets.length) targets.push(document);
    for (const _target of targets) {
      const target = _target.shadowRoot || _target;
      this.targets.remove(target);
    }
    return this;
  }

  /* Adopts sheet to targets. */
  use(...targets) {
    if (!targets.length) targets.push(document);
    for (const _target of targets) {
      const target = _target.shadowRoot || _target;
      this.targets.add(target);
    }
    return this;
  }
}

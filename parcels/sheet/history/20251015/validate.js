const cls = class extends HTMLElement {
  constructor() {
    super();
  }
};

customElements.define("data-sheet-validator", cls);

const validator = new cls();

export default (key) => key in validator.style || key.startsWith("--");

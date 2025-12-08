const cls = class extends HTMLElement {
  constructor() {
    super();
  }
};

customElements.define("sheet-reference", cls);

export const reference = new cls();

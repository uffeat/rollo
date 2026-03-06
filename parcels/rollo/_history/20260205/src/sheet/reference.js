const cls = class extends HTMLElement {
  constructor() {
    super();
  }
};

if (!customElements.get("sheet-reference")) {
  customElements.define("sheet-reference", cls);
}

export const reference = new cls();

export const browser = new (class {
  #_ = {};

  constructor() {}

  get capabilities() {
    if (this.#_.capabilities === undefined) {
      this.#_.capabilities = new (class {
        #_ = {};

        get anchor() {
          if (this.#_.anchor === undefined) {
            this.#_.anchor = window.CSS && CSS.supports("anchor-name: --test");
          }
          return this.#_.anchor;
        }

        get popover() {
          if (this.#_.popover === undefined) {
            this.#_.popover = "showPopover" in HTMLElement.prototype;
          }
          return this.#_.popover;
        }
      })();
    }
    return this.#_.capabilities;
  }
})();

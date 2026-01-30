import "../use";

const { Modal: BsModal } = await use("@/bootstrap/");

console.log("BsModal:", BsModal); ////

const { app, component, element, html } = await use("@/rollo/");

class Modal {
  #_ = {};

  constructor({
    buttons,
    centered,
    content,
    dismissible = true,
    fade = true,
    scrollable,
    size,
    style,
    tag = "div",
    title,
  } = {}) {
    const options = { backdrop: true };

    this.#_.host = component.from(
      html`<div id="_modal" class="modal ${fade ? "fade" : ""}" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <header class="modal-header">
              <h1 class="modal-title"></h1>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                data-bs-dismiss="modal"
              ></button>
            </header>
            <div class="modal-body"></div>
            <footer class="modal-footer"></footer>
          </div>
        </div>
      </div>`,
    );

    document.body.append(this.#_.host);

    this.#_.dialog = this.#_.host.querySelector(".modal-dialog");
    this.#_.content = this.#_.host.querySelector(".modal-content");
    this.#_.header = this.#_.host.querySelector(".modal-header");
    this.#_.body = this.#_.host.querySelector(".modal-body");
    this.#_.footer = this.#_.host.querySelector(".modal-footer");
    this.#_.dismissButton = this.#_.host.querySelector("button.btn-close");

    if (buttons) {
      this.#_.footer.append(...buttons);
    } else {
      this.#_.footer.remove();
    }

    /* Body content */
    if (content) {
      this.#_.body.append(content);
    } else {
      this.#_.body.remove();
    }

    /* Title */
    this.#_.title = this.#_.host.querySelector(".modal-title");
    if (title) {
      this.#_.title.text = title;
    } else {
      this.#_.title.remove();
    }
    /* Dismissible */
    if (!dismissible) {
      this.#_.dismissButton.remove();
      options.backdrop = "static";
    }

    this.#_.modal = new BsModal(this.#_.host, options);

    this.#_.dialog.on._close((event) => {
      //const value = event.detail;
      event.stopPropagation();
      this.#_.modal.hide();
    });
  }

  show() {
    this.#_.modal.show();
    return this;
  }
}

export const modal = async (...args) => {
  const instance = new Modal(...args);
  instance.show();
};

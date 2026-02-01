import "../use";

const { Modal } = await use("@/bootstrap/");

const { app, component, element, html, mixup } = await use("@/rollo/");

export const modal = async (
  {
    centered,
    content,
    dismissible = true,
    fade = true,
    scrollable,
    size,
    style,
    tag = "div",
    title,
  } = {},
  ...buttons
) => {
 

  const options = { backdrop: true };

  const host = component.from(
    html`<div id="modal" class="modal ${fade ? "fade" : ""}" tabindex="-1">
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

  document.body.append(host);

  /* Extract tree components */
  const tree = {};
  tree.dialog = host.querySelector(".modal-dialog");
  tree.content = host.querySelector(".modal-content");
  tree.header = host.querySelector(".modal-header");
  tree.body = host.querySelector(".modal-body");
  tree.footer = host.querySelector(".modal-footer");
  tree.dismiss = host.querySelector("button.btn-close");
  tree.title = host.querySelector(".modal-title");
  /* Action buttons */
  if (buttons.length) {
    tree.footer.append(...buttons);
  } else {
    tree.footer.remove();
  }
  /* Title */
  if (title) {
    tree.title.text = title;
  } else {
    tree.title.remove();
  }
  /* Dismissible */
  if (dismissible) {
    host.on.click((event) => {
      /* Remove focus from hidden element */
      if (event.target === tree.dismiss || event.target === host) {
        event.target?.blur();
      }
    });
  } else {
    tree.dismiss.remove();
    options.backdrop = "static";
  }
  /* Create Bootstrap modal */

  const controller = new Modal(host, options);

  /* Clean up */
  host.on["hidden.bs.modal"]({ once: true }, (event) => {
    event.stopPropagation();
    controller.dispose();
    host.remove();
  });

  return new Promise((resolve) => {
    mixup(
      host,
      class {
        get tree() {
          return tree;
        }

        close(result) {
          /* Remove focus from hidden element */
          const active = document.activeElement;
          if (active && this.contains(active)) {
            active?.blur();
          }
          host.detail.result = result;
          resolve(host.detail.result);
          controller.hide();
          return this;
        }

        show() {
          controller.show();
          return this;
        }
      },
    );

    /* Handle '_close' event */
    host.on._close({ once: true }, (event) => {
      event.stopPropagation();
      const result = event.detail;
      host.close(result);
    });

    /* Body content */
    if (content) {
      if (typeof content === "function") {
        content = content(host);
      }
      tree.body.append(content);
    } else {
      tree.body.remove();
    }

    host.on["hide.bs.modal"]({ once: true }, (event) => {
      event.stopPropagation();
      if (!("result" in host.detail)) {
        /* Not explicitly resolved -> resolve to null */
        host.detail.result = null;
        resolve(host.detail.result);
      }
    });

    host.show();
  });
};

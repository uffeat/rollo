import "@/bootstrap.scss";

import { Modal } from "bootstrap";
import { create_element } from "utils/create_element";

const COLOR = "navy";
const SIZE = "12rem";

const element = create_element(
  `div.modal.fade`,
  {},
  create_element(
    `div.modal-dialog.modal-dialog-centered.d-flex.justify-content-center`,
    {},
    create_element(
      "div.spinner-border",
      {
        height: SIZE,
        width: SIZE,
        role: "status",
        borderColor: `${COLOR} ${COLOR} ${COLOR} transparent`,
        borderWidth: "0.375rem",
      },
      create_element("span.visually-hidden", {}, "Loading...")
    )
  )
).update_attrs({ tabindex: "-1" });

// Create Bootstrap Modal
const modal = new Modal(element, { backdrop: "static", keyboard: false });

// Clean-up
element.addEventListener("hidden.bs.modal", () => {
  element.remove();
});

class Spinner {
  show = () => {
    if (document.body.contains(element)) {
      throw new Error(`Attempt to show multiple spinners.`)
    }
    document.body.append(element);
    modal.show();
  };

  hide = () => {
    modal.hide();
  };
}

export const spinner = new Spinner();

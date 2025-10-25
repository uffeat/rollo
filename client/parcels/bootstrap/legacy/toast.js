import "@/bootstrap.scss";

import { Toast } from "bootstrap";

import { create_element } from "@/utils/create_element"; ////


// Create toast container to control stacked toasts
document.body.classList.add("position-relative");
const toast_container = create_element(
  `div.position-fixed.bottom-0.end-0.p-3.d-flex.flex-column.row-gap-3.z-3`,
  { id: "toastContainer", parent: document.body }
);

/* Shows a toast */
export function toast(
  title,
  content,
  {
    animation = true,
    autohide = true,
    delay = 5000,
    dismissible = true,
    style = "primary",
  } = {}
) {
  // Prepare styling
  const header_class = `.text-bg-${style}`;
  let dismiss_class = "";
  if (["danger", "primary", "secondary", "success"].includes(style)) {
    dismiss_class = `.btn-close-white`;
  }

  // Prepare title
  if (title) {
    if (typeof title === "string") {
      title = create_element(`h1.fs-6.text.p-0.m-0`, {}, title);
    }
  }

  // Prepare content
  if (content) {
    if (typeof content === "string") {
      content = create_element(`p.m-0`, {}, content);
    }
  }

  // Handle dismiss button
  if (dismissible) {
    dismissible = create_element(`button.btn-close.ms-auto${dismiss_class}`, {
      type: "button",
    })
      .update_dataset({
        bsDismiss: "toast",
      })
      .update_attrs({ "aria-label": "Close" });
  } else {
    dismissible = "";
  }

  // Create toast element
  const element = create_element(
    `div.toast`,
    { parent: toast_container, role: "alert" },
    create_element(
      `div.toast-header.d-flex.align-items-center${header_class}`,
      {},
      title,
      dismissible
    ),
    create_element(`div.toast-body`, {}, content)
  ).update_attrs({ "aria-live": "assertive", "aria-atomic": "true" });

  // Create Bootstrap Toast
  const toast = new Toast(element, { animation, autohide, delay });

  // Ensure clean-up
  element.addEventListener("hidden.bs.toast", () => {
    toast.dispose();
    element.remove();
  });

  // Show the toast
  toast.show();
}

/*
# EXAMPLES

## Example: Hello World

import toast from "utils/toast";

toast({
  title: "Hello world!",
  content: "The toast function is awesome.",
  delay: 10000,
  style: 'success'
});

*/

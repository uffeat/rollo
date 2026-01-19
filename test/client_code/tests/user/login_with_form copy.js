/*
user/login_with_form.js
*/

export default async () => {
  const { css } = await use("@/rollo/");

  css`
    .anvil-modal-backdrop {
      background-color: #495057;
    }

    .anvil-modal *:focus {
      outline: none;
    }

    .anvil-modal-content {
      --primary: #0d6efd;

      font-size: 1rem;
      background-color: #212529;
      color: #dee2e6;
    }

    /* Links (and link-like) */
    .anvil-link-text {
      font-size: 1rem;
      color: rgba(110, 168, 254);
    }

    /* Title */
    .anvil-modal-title {
      font-size: 2rem;
      font-weight: 400;
      text-transform: lowercase;
    }
    .anvil-modal-title::first-letter {
      text-transform: uppercase;
    }

    /* Section borders */
    .anvil-modal-header {
      border-bottom: none;
    }
    .anvil-modal-footer {
      border-top: none;
    }

    /* Close button */
    .anvil-modal-header button.anvil-close {
      justify-content: center;
      align-items: center;
      margin: 0;
      display: flex;
    }
    .anvil-modal-header button.anvil-close > span {
      --size: 1.5rem !important;
      width: var(--size);
      height: var(--size);
      content: url("_/theme/icons/close.svg");
    }

    /* Form controls */
    .anvil-label-text {
      font-weight: 400 !important;
    }

    /* XXX Fragile */
    li:last-of-type .anvil-label-text {
      font-size: 1.0625rem;
      color: #ea868f !important;
      margin: 0.5rem 0;
    }

    .anvil-form-control {
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;

      /* Colors - dark mode */
      color: #dee2e6;
      background-color: #212529;
      border: 1px solid #495057;

      /* Shape */
      border-radius: 0.375rem;

      /* Typography */
      font-family: inherit;
      font-weight: 400;

      /* Interaction */
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      appearance: none;
    }
    .anvil-form-control:focus {
      color: #dee2e6;
      background-color: #212529;
      border-color: #86b7fe;
      outline: 0;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }
    .anvil-form-control::placeholder {
      color: #6c757d;
      opacity: 1;
    }

    /* Footer */
    .anvil-alert-footer-button-panel {
      column-gap: 1rem;
    }

    /* Action buttons */
    .anvil-btn {
      font-size: 1rem;
      color: #fff;
      padding: 0.375rem 0.75rem;
    }

    .anvil-btn-default {
      background-color: #6c757d;
      border-color: #6c757d;
      text-shadow: none;
      background-image: none;
    }

    .anvil-btn-default:hover {
      color: #fff !important;
      background-color: #5c636a;
      border-color: #565e64;
    }

    .anvil-btn-success {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }

    .anvil-btn-success:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
    }

    /* Sets capital-case for footer buttons. */
    .anvil-modal-footer button {
      text-transform: lowercase;
    }
    .anvil-modal-footer button::first-letter {
      text-transform: uppercase;
    }

    .anvil-component-icon {
      color: #dee2e6 !important;
    }

    @media (min-width: 768px) {
      .anvil-modal-sm {
        width: 600px;
      }
    }
  `.use();

  const login_with_form = use("@@/user:login_with_form");

  const options = {
    childList: true,
    subtree: false,
  };

  const observer = new MutationObserver((records, observer) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.matches(".anvil-modal")) {
          console.log("Modal added:", node);
        }
      }
      for (const node of record.removedNodes) {
        if (node.matches(".anvil-modal")) {
          console.log("Modal removed:", node);
        }
      }
    }
  });

  observer.observe(document.body, options);

  const result = login_with_form({
    allow_cancel: true,
    allow_remembered: false,
    show_signup_option: false,
  });
};

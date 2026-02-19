import { UIkit } from "./uk.js";

const { Future } = await use("@/tools/future.js");
const { Sheet, css } = await use("@/sheet.js");
const { component } = await use("@/component.js");
const { type } = await use("/tools/type.js");

//const sheet = await use("/assets/uk/modal.css");

document.documentElement.dataset.bsTheme = "dark";

const sheet = Sheet.create();

sheet.rules.add({
  ".uk-modal-full .uk-modal-dialog": {
    height: css.pct(100),
  },

  ".uk-modal-dialog": {
    minHeight: css.rem(4),
    ...css.display.flex,
    ...css.flexDirection.column,
    backgroundColor: css.__.bsLightBgSubtle,
  },

  "button[uk-close]": {
    /* Need this for `uk-close-large` buttons */
    backgroundColor: "transparent",
  },

  "button[uk-close] svg": {
    color: css.__.bsLight,
  },

  "button[uk-close]:hover svg": {
    color: css.__.bsGray500,
  },

  "button.uk-modal-close-default[uk-close] svg": {
    width: css.px(18),
    height: css.px(18),
  },

  ".uk-modal-body": {
    flexGrow: String(1),
    ...css.display.flex,
    ...css.flexDirection.column,
    paddingBottom: css.rem(1),
  },

  ".uk-modal-body :is(h1, h2, h3, h4, h5, h6, p)": {
    color: css.__.bsLight,
  },
});

export const modal = (content, ...args) => {
  /* Parse args */
  const {
    detail,
    dismissible = true,
    full = false,
    scroll = false,
  } = args.find((a) => type(a) === "Object") || {};
  const callback = args.find((a) => typeof a === "function");

  /* Build tree */
  const element = component.div(
    `${full ? "uk-modal-full" : ""}`,
    {
      "[uk-modal]": JSON.stringify({
        "esc-close": dismissible,
        "bg-close": dismissible,
      }),
    },
    component.div(
      "uk-modal-dialog",
      {
        "[uk-overflow-auto]": scroll,
      },
      component.button(
        full ? "uk-modal-close-full.uk-close-large" : "uk-modal-close-default",
        { "[uk-close]": true, "[hidden]": dismissible ? false : true }
      ),
      component.div("uk-modal-body", content)
    )
  );

  /* Create modal */
  const modal = UIkit.modal(element);

  /* Create future to control modal result */
  const future = Future.create(callback, {
    detail,
    name: "modal",
    owner: modal,
  });

  element.on.beforeshow$once = (event) => {
    event.stopPropagation();
    /* Use sheet */
    sheet.use();
  };

  element.on.show$once = (event) => {
    event.stopPropagation();
    /* Could choose to use sheet here, rather than in beforeshow...
    - Pro: No need for timing out sheet unuse in hidden.
    - Con: Slight style delay (unnoticeable). */
  };

  element.on.hide$once = (event) => {
    event.stopPropagation();
    /* Check, if not resolved, which is the case, if hiding 
    triggered by dismissal */
    if (!future.resolved) {
      future.resolve(null);
    }
  };

  /* Processes result and cleans up.
  NOTE Always called at the end of a modal cycle. */
  element.on.hidden$once = (event) => {
    event.stopPropagation();
    modal.$destroy(true);

    /* Unuse sheet 
    NOTE Only ununse sheet if another modal is not on the way. 
    Use 'uk-modal-page' to detect this... However, 'uk-modal-page' is only 
    removed AFTER this event fires, which is why we time out. */
    setTimeout(() => {
      if (!document.documentElement.classList.contains("uk-modal-page")) {
        sheet.unuse();
      }
    }, 0);
  };

  /* Enables closing from content */
  element.on._close$once = (event) => {
    future.resolve(event?.detail);
    modal.hide();
  };

  /* Show modal */
  modal.show();

  return future.promise;
};

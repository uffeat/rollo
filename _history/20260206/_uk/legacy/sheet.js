/* JS-version of modal sheet */

const { Sheet, css } = await use("@/sheet.js");

document.documentElement.dataset.bsTheme = "dark";

const sheet = Sheet.create();

sheet.rules.add({
  ".uk-modal-full .uk-modal-dialog": {
    height: css.pct(100),
  },
  
  ".uk-modal-dialog": {
    minHeight: css.rem(4),
    display: "flex",
    flexDirection: "column",
    backgroundColor: css.__.bsLightBgSubtle,
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
    display: "flex",
    flexDirection: "column",
    paddingBottom: css.rem(1),
  },

  ".uk-modal-body :is(h1, h2, h3, h4, h5, h6, p)": {
    color: css.__.bsLight,
  },
});
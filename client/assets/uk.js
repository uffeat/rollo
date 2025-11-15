await use("/assets/uk/uk.js", { as: "function" });
await use("/assets/uk/uk-icons.js", { as: "function" });
await use("/assets/uk/uk.css", { as: "link" });
const h = globalThis.UIkit, { Future: f } = await use("@/tools/future.js"), { Sheet: g, css: e } = await use("@/sheet.js"), { component: a } = await use("@/component.js"), { type: p } = await use("/tools/type.js");
document.documentElement.dataset.bsTheme = "dark";
const n = g.create();
n.rules.add({
  ".uk-modal-full .uk-modal-dialog": {
    height: e.pct(100)
  },
  ".uk-modal-dialog": {
    minHeight: e.rem(4),
    ...e.display.flex,
    ...e.flexDirection.column,
    backgroundColor: e.__.bsLightBgSubtle
  },
  "button[uk-close]": {
    /* Need this for `uk-close-large` buttons */
    backgroundColor: "transparent"
  },
  "button[uk-close] svg": {
    color: e.__.bsLight
  },
  "button[uk-close]:hover svg": {
    color: e.__.bsGray500
  },
  "button.uk-modal-close-default[uk-close] svg": {
    width: e.px(18),
    height: e.px(18)
  },
  ".uk-modal-body": {
    flexGrow: String(1),
    ...e.display.flex,
    ...e.flexDirection.column,
    paddingBottom: e.rem(1)
  },
  ".uk-modal-body :is(h1, h2, h3, h4, h5, h6, p)": {
    color: e.__.bsLight
  }
});
const b = (d, ...i) => {
  const {
    detail: r,
    dismissible: u = !0,
    full: c = !1,
    scroll: m = !1
  } = i.find((o) => p(o) === "Object") || {}, k = i.find((o) => typeof o == "function"), t = a.div(
    `${c ? "uk-modal-full" : ""}`,
    {
      "[uk-modal]": JSON.stringify({
        "esc-close": u,
        "bg-close": u
      })
    },
    a.div(
      "uk-modal-dialog",
      {
        "[uk-overflow-auto]": m
      },
      a.button(
        c ? "uk-modal-close-full.uk-close-large" : "uk-modal-close-default",
        { "[uk-close]": !0, "[hidden]": !u }
      ),
      a.div("uk-modal-body", d)
    )
  ), s = h.modal(t), l = f.create(k, {
    detail: r,
    name: "modal",
    owner: s
  });
  return t.on.beforeshow$once = (o) => {
    o.stopPropagation(), n.use();
  }, t.on.show$once = (o) => {
    o.stopPropagation();
  }, t.on.hide$once = (o) => {
    o.stopPropagation(), l.resolved || l.resolve(null);
  }, t.on.hidden$once = (o) => {
    o.stopPropagation(), s.$destroy(!0), setTimeout(() => {
      document.documentElement.classList.contains("uk-modal-page") || n.unuse();
    }, 0);
  }, t.on._close$once = (o) => {
    l.resolve(o?.detail), s.hide();
  }, s.show(), l.promise;
};
export {
  h as UIkit,
  b as modal
};

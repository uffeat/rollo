const { Modal: u } = await use("@/bootstrap/"), { app: w, component: p, element: S, html: b, mixup: f } = await use("@/rollo/"), x = async ({
  centered: h,
  content: s,
  dismissible: n = !0,
  fade: m = !0,
  scrollable: y,
  size: g,
  style: v,
  tag: q = "div",
  title: d
} = {}, ...i) => {
  const c = { backdrop: !0 }, e = p.from(
    b`<div id="modal" class="modal ${m ? "fade" : ""}" tabindex="-1">
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
    </div>`
  );
  document.body.append(e);
  const o = {};
  o.dialog = e.querySelector(".modal-dialog"), o.content = e.querySelector(".modal-content"), o.header = e.querySelector(".modal-header"), o.body = e.querySelector(".modal-body"), o.footer = e.querySelector(".modal-footer"), o.dismiss = e.querySelector("button.btn-close"), o.title = e.querySelector(".modal-title"), i.length ? o.footer.append(...i) : o.footer.remove(), d ? o.title.text = d : o.title.remove(), n ? e.on.click((t) => {
    (t.target === o.dismiss || t.target === e) && t.target?.blur();
  }) : (o.dismiss.remove(), c.backdrop = "static");
  const r = new u(e, c);
  return e.on["hidden.bs.modal"]({ once: !0 }, (t) => {
    t.stopPropagation(), r.dispose(), e.remove();
  }), new Promise((t) => {
    f(
      e,
      class {
        get tree() {
          return o;
        }
        close(l) {
          const a = document.activeElement;
          return a && this.contains(a) && a?.blur(), e.detail.result = l, t(e.detail.result), r.hide(), this;
        }
        show() {
          return r.show(), this;
        }
      }
    ), e.on._close({ once: !0 }, (l) => {
      l.stopPropagation();
      const a = l.detail;
      e.close(a);
    }), s ? (typeof s == "function" && (s = s(e)), o.body.append(s)) : o.body.remove(), e.on["hide.bs.modal"]({ once: !0 }, (l) => {
      l.stopPropagation(), "result" in e.detail || (e.detail.result = null, t(e.detail.result));
    }), e.show();
  });
};
export {
  x as modal
};

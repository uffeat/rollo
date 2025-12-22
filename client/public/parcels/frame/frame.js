const { app: c } = await use("@/rollo/"), { Mixins: u, author: h, component: e, mix: l } = await use("@/rollo/"), g = await use("@/bootstrap/reboot.css"), m = await use("@/frame/shadow.css", { auto: !0 }), r = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg")
}, d = h(
  class extends l(HTMLElement, {}, ...u()) {
    #t = {};
    constructor() {
      super();
      const t = this, o = e.section(
        "side",
        e.button("toggle", {
          ariaLabel: "Close",
          innerHTML: r.close
        }),
        e.slot({ name: "side" })
      ), i = e.div(
        { id: "root" },
        e.header(
          e.slot({ name: "home" }),
          e.button("toggle", {
            ariaLabel: "Toggle",
            innerHTML: r.menu
          }),
          e.section(e.slot({ name: "top" }))
        ),
        e.section(
          "main",
          o,
          e.main(e.slot())
        ),
        e.footer()
      );
      this.attachShadow({ mode: "open" }).append(i), g.use(this), m.use(this), this.#t.config = new class {
        get easing() {
          return t.__.easing;
        }
        get time() {
          return t.attribute.time;
        }
        get width() {
          return t.__.width;
        }
        update({
          /* Defaults */
          easing: s = "ease-in-out",
          time: n = "200ms",
          width: a = "300px"
        } = {}) {
          t.__.easing = s, t.__.width = a, t.attribute.time = n, t.send("_config", { detail: { easing: s, time: n, width: a } });
        }
      }(), this.config.update(), o.on.transitionstart((s) => {
        this.attribute.open ? this.send("_open_start") : this.send("_close_start");
      }), o.on.transitionend((s) => {
        this.attribute.open ? this.send("_close_end") : this.send("_open_end"), this.__.time = 0;
      }), i.on.click((s) => {
        if (i.contains(s.target) && s.target.closest(".toggle")) {
          this.toggle();
          return;
        }
        (s.target.closest("main") || !i.contains(s.target) && !s.target.closest('[slot="side"]')) && this.close();
      });
    }
    get config() {
      return this.#t.config;
    }
    close(t = !0) {
      t && (this.__.time = this.config.time), this.attribute.open = !1;
    }
    open(t = !0) {
      t && (this.__.time = this.config.time), this.attribute.open = !0;
    }
    toggle(t = !0) {
      t && (this.__.time = this.config.time), this.attribute.open = !this.attribute.open;
    }
  },
  "frame-component"
), _ = d({ id: "frame", parent: c });
export {
  _ as frame
};

const { app: a } = await use("@/rollo/"), { Mixins: h, author: r, component: s, mix: d } = await use("@/rollo/"), c = await use("@/bootstrap/reboot.css"), l = await use("@/frame/shadow.css", { auto: !0 }), n = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg")
}, _ = r(
  class extends d(HTMLElement, {}, ...h()) {
    #e = {
      tree: {}
    };
    constructor() {
      super(), this.#e.shadow = s.div(
        { id: "root" },
        s.header(
          s.slot({ name: "home" }),
          s.button("_close", {
            ariaLabel: "Toggle",
            innerHTML: n.menu
          }),
          s.section(s.slot({ name: "top" }))
        ),
        s.section(
          "_main",
          s.section(
            "_side",
            s.button("_close", {
              ariaLabel: "Close",
              innerHTML: n.close
            }),
            s.slot({ name: "side" })
          ),
          s.main(s.slot())
        ),
        s.footer()
      ), this.attachShadow({ mode: "open" }).append(this.shadow), c.use(this), l.use(this), this.#e.config = new class {
        #s = {};
        constructor(t) {
          this.#s.owner = t;
        }
        get owner() {
          return this.#s.owner;
        }
        get easing() {
          return this.owner.__.easing;
        }
        get time() {
          return this.owner.attribute._time;
        }
        get width() {
          return this.owner.__.width;
        }
        update({
          easing: t = "ease-in-out",
          time: i = "200ms",
          width: o = "300px"
        } = {}) {
          this.owner.__.easing = t, this.owner.__.width = o, this.owner.attribute._time = i, this.owner.send("_config", { detail: { easing: t, time: i, width: o } });
        }
      }(this), this.config.update(), (() => {
        const e = window.matchMedia("(width >= 768px)");
        e.matches ? (this.classes.add("_md"), this.send("_md", { detail: !0 })) : this.send("_md", { detail: !1 }), e.addEventListener("change", (t) => {
          t.matches ? (this.classes.add("_md"), this.send("_md", { detail: !0 })) : (this.classes.remove("_md"), this.send("_md", { detail: !1 }));
        });
      })(), this.tree.header = this.shadow.find("header"), this.tree.side = this.shadow.find("section._side"), this.tree.slot = this.shadow.find("main>slot"), this.tree.main = this.shadow.find("main"), this.tree.header = this.shadow.find("header"), this.tree.side.addEventListener("transitionstart", (e) => {
        this.classes.has("_close") ? this.send("_close_start") : this.send("_open_start");
      }), this.tree.side.addEventListener("transitionend", (e) => {
        this.classes.has("_close") ? this.send("_close_end") : this.send("_open_end"), this.__.time = 0;
      }), this.shadow.on.click = (e) => {
        if (this.shadow.contains(e.target) && e.target.closest("._close")) {
          this.toggle();
          return;
        }
        (e.target.closest("main") || !this.shadow.contains(e.target) && !e.target.closest('[slot="side"]')) && this.close();
      };
    }
    get config() {
      return this.#e.config;
    }
    get shadow() {
      return this.#e.shadow;
    }
    get tree() {
      return this.#e.tree;
    }
    close(e = !0) {
      e && (this.__.time = this.config.time), this.classes.add("_close");
    }
    open(e = !0) {
      e && (this.__.time = this.config.time), this.classes.remove("_close");
    }
    toggle(e = !0) {
      e && (this.__.time = this.config.time), this.classes.toggle("_close");
    }
  },
  "frame-component"
), u = _({ id: "frame", parent: a });
export {
  u as frame
};

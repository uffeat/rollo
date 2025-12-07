const h = `#root {\r
  position: relative;\r
  width: 100%;\r
  min-height: 100vh;\r
  display: flex;\r
  flex-direction: column;\r
  background-color: var(--bs-body-bg);\r
  /**/\r
  /*border: 2px solid orange;*/\r
}\r
\r
header {\r
  --gap: 0.375rem;\r
  display: flex;\r
  align-items: center;\r
  column-gap: var(--gap);\r
  background-color: var(--bs-primary);\r
  padding: var(--gap) 1rem;\r
}\r
\r
header button {\r
  display: flex;\r
  background-color: transparent;\r
  border: none;\r
}\r
\r
header button svg {\r
  --size: 2.4rem;\r
  width: var(--size);\r
  height: var(--size);\r
  fill: var(--bs-light);\r
}\r
\r
header button:hover svg {\r
  fill: var(--bs-gray-300);\r
}\r
\r
section:has(> slot[name="top"]) {\r
  margin-left: auto;\r
}\r
\r
section._main {\r
  flex-grow: 1;\r
  display: flex;\r
  flex-direction: column;\r
}\r
\r
section._side {\r
  position: absolute;\r
  top: 0;\r
  bottom: 0;\r
  width: min(var(--width), 100%);\r
  display: flex;\r
  flex-direction: column;\r
  transform: translateX(0);\r
  transition: transform var(--time) var(--easing);\r
  background-color: var(--bs-body-bg);\r
  opacity: 0.99;\r
  padding: 0.5rem 0;\r
  border-right: 1px solid var(--bs-border-color-translucent);\r
  z-index: 100;\r
  overflow-y: auto;\r
  /**/\r
  /*border: 4px solid var(--bs-danger);*/\r
}\r
\r
:host(._close) section._side {\r
  transform: translateX(-100%);\r
}\r
\r
/* Close button */\r
section._side button {\r
  align-self: flex-end;\r
  justify-self: center;\r
  display: flex;\r
  background-color: transparent;\r
  padding: 0.5rem;\r
  border: none;\r
  margin-bottom: 1rem;\r
  margin-right: 0.25rem;\r
}\r
section._side button svg {\r
  --size: 24px;\r
  width: var(--size);\r
  height: var(--size);\r
  fill: var(--bs-light);/*color instead?*/\r
}\r
section._side button:hover svg {\r
  fill: var(--bs-gray-500);\r
}\r
\r
main {\r
  flex-grow: 1;\r
  width: 100%;\r
  display: flex;\r
  flex-wrap: wrap;\r
  align-items: start;\r
  background-color: transparent;\r
  /**/\r
  /*border: 4px solid var(--bs-success);*/\r
}\r
\r
footer {\r
  min-height: 100px;\r
  display: flex;\r
  padding: 0.375rem 1rem;\r
  background-color: var(--bs-light-bg-subtle);\r
  border-top: 1px solid var(--bs-border-color-translucent);\r
  margin-top: auto !important;\r
}\r
\r
/* Push-style side action. */\r
:host(._md) section._main {\r
  flex-direction: row;\r
}\r
:host(._md) section._side {\r
  position: static;\r
}\r
:host(._md) main {\r
  transition: margin-left var(--time) var(--easing);\r
}\r
:host(._md._close) main {\r
  margin-left: calc(-1 * min(var(--width), 100%));\r
}\r
`, { app: d } = await use("@/app/"), a = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg")
}, { Sheet: l } = await use("@/sheet"), c = await use("@/bootstrap/reboot.css"), { Mixins: g, author: m, component: t, mix: u } = await use("@/component"), b = m(
  class extends u(HTMLElement, {}, ...g()) {
    #t = {
      tree: {}
    };
    constructor() {
      super(), this.#t.shadow = t.div(
        { id: "root" },
        t.header(
          t.slot({ name: "home" }),
          t.button("_close", {
            ariaLabel: "Toggle",
            innerHTML: a.menu
          }),
          t.section(t.slot({ name: "top" }))
        ),
        t.section(
          "_main",
          t.section(
            "_side",
            t.button("_close", {
              ariaLabel: "Close",
              innerHTML: a.close
            }),
            t.slot({ name: "side" })
          ),
          t.main(t.slot())
        ),
        t.footer()
      ), this.attachShadow({ mode: "open" }).append(this.shadow), c.use(this), l.create(h).use(this), this.#t.config = new class {
        #e = {};
        constructor(r) {
          this.#e.owner = r;
        }
        get owner() {
          return this.#e.owner;
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
          easing: r = "ease-in-out",
          time: n = "200ms",
          width: s = "300px"
        } = {}) {
          this.owner.__.easing = r, this.owner.__.width = s, this.owner.attribute._time = n, this.owner.send("_config", { detail: { easing: r, time: n, width: s } });
        }
      }(this), this.config.update(), (() => {
        const e = window.matchMedia("(width >= 768px)");
        e.matches ? (this.classes.add("_md"), this.send("_md", { detail: !0 })) : this.send("_md", { detail: !1 }), e.addEventListener("change", (r) => {
          r.matches ? (this.classes.add("_md"), this.send("_md", { detail: !0 })) : (this.classes.remove("_md"), this.send("_md", { detail: !1 }));
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
      }, this.#t.observer = new class {
        #e = {
          observers: {}
        };
        constructor(r) {
          this.#e.owner = r, this.#e.observers.header = new ResizeObserver((n) => {
            setTimeout(() => {
              for (const s of n) {
                const i = this.owner.tree.header.clientHeight;
                this.owner.attribute._top = i, this.owner.send("_header_resize", { detail: { top: i } });
              }
            }, 0);
          }), this.#e.observers.main = new ResizeObserver((n) => {
            setTimeout(() => {
              for (const s of n) {
                const i = s.contentRect.width;
                this.owner.attribute._width = i;
                const o = s.contentRect.height;
                this.owner.attribute._height = o, this.owner.send("_main_resize", { detail: { width: i, height: o } });
              }
            }, 0);
          });
        }
        get owner() {
          return this.#e.owner;
        }
        start() {
          return this.#e.observers.header.observe(this.owner.tree.header), this.#e.observers.main.observe(this.owner.tree.main), this.owner.attribute._observes = !0, this.owner;
        }
        stop() {
          return this.#e.observers.header.disconnect(), this.#e.observers.main.disconnect(), this.owner.attribute._observes = !1, this.owner;
        }
      }(this);
    }
    /* Exposes current size data as attributes. */
    connectedCallback() {
      const e = this.tree.header.clientHeight;
      this.attribute._top = e;
      const r = this.tree.main.getBoundingClientRect().width;
      this.attribute._width = r;
      const n = this.tree.main.getBoundingClientRect().height;
      this.attribute._height = n;
    }
    get config() {
      return this.#t.config;
    }
    get observer() {
      return this.#t.observer;
    }
    get shadow() {
      return this.#t.shadow;
    }
    get tree() {
      return this.#t.tree;
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
  "layout-component"
), p = b({ id: "layout", parent: d });
export {
  b as Layout,
  p as layout
};

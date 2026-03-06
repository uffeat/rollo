const { app: d, Mixins: h, author: c, breakpoints: m, component: e, css: g, mix: u, stateMixin: p } = await use("@/rollo/"), b = await use("@/bootstrap/reboot.css"), a = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg")
}, r = c(
  class extends u(HTMLElement, {}, ...h(p)) {
    #t = {};
    constructor() {
      super();
      const t = this;
      this.#t.slots = Object.freeze({
        default: e.slot(),
        home: e.slot({ name: "home" }),
        side: e.slot({ name: "side" }),
        top: e.slot({ name: "top" })
        //iworker: component.slot({ name: "iworker" }),
      });
      const s = e.section(
        "side",
        e.button("toggle", {
          ariaLabel: "Close",
          innerHTML: a.close
        }),
        this.#t.slots.side
      );
      this.#t.shadow = e.div(
        { id: "root" },
        e.header(
          this.#t.slots.home,
          e.button("toggle", {
            ariaLabel: "Toggle",
            innerHTML: a.menu
          }),
          e.section(this.#t.slots.top)
        ),
        e.section("main", s, e.main(this.#t.slots.default)),
        e.footer()
      ), this.attachShadow({ mode: "open" }).append(this.#t.shadow), b.use(this), g`
        #root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bs-body-bg);
        }

        header {
          --gap: 0.375rem;
          display: flex;
          align-items: center;
          column-gap: var(--gap);
          background-color: var(--bs-primary);
          padding: var(--gap) 1rem;
        }

        header button {
          display: flex;
          background-color: transparent;
          border: none;
        }

        header button svg {
          --size: 2.4rem;
          width: var(--size);
          height: var(--size);
          fill: var(--bs-light);
        }

        header button:hover svg {
          fill: var(--bs-gray-300);
        }

        section:has(${'> slot[name="top"]'}) {
          margin-left: auto;
        }

        section.main > section.side {
          position: absolute;
          top: 0;
          bottom: 0;
          width: min(var(--width), 100%);
          display: flex;
          flex-direction: column;
          transform: translateX(0);
          transition: transform var(--time) var(--easing);
          background-color: var(--bs-body-bg);
          opacity: 0.99;
          padding: 0.5rem 0;
          border-right: 1px solid var(--bs-border-color-translucent);
          z-index: 100;
          overflow-y: auto;
        }

        :host(:not([open])) section.main > section.side {
          /* Overlay-style side action. */
          transform: translateX(-100%);
        }

        /* Close button */
        section.main > section.side button {
          margin-left: auto;
          display: flex;
          background-color: transparent;
          padding: 0.5rem;
          border: none;
          margin-bottom: 1rem;
          margin-right: 0.25rem;
        }
        section.main > section.side button svg {
          --size: 24px;
          width: var(--size);
          height: var(--size);
          fill: var(--bs-light);
        }
        section.main > section.side button:hover svg {
          fill: var(--bs-gray-500);
        }

        section.main > main {
          flex-grow: 1;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: start;
          background-color: transparent;
        }

        footer {
          min-height: 100px;
          display: flex;
          padding: 0.375rem 1rem;
          background-color: var(--bs-light-bg-subtle);
          border-top: 1px solid var(--bs-border-color-translucent);
          margin-top: auto !important;
        }

        /* Interpolate query to use 'breakpoints' and to prevent the linter 
        from (harmless) barking (does not like ' >='). */
        @media (${"width >= "}${m.md}px) {
          /* Shift-style side action. */

          section.main {
            position: relative;
            /* Push down to footer */
            flex-grow: 1;
          }

          section.main > section.side {
            height: 100%;
          }
          section.main > main {
            transform: translateX(calc(1 * var(--width)));
            transition: transform var(--time) var(--easing);
          }
          :host(:not([open])) section.main > main {
            transform: translateX(0);
          }
        }
      `.use(this), this.#t.config = new class {
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
          // Defaults
          easing: i = "ease-in-out",
          time: o = "200ms",
          width: n = "300px"
        } = {}) {
          t.__.easing = i, t.__.width = n, t.attribute.time = o, t.send("_config", { detail: { easing: i, time: o, width: n } });
        }
      }(), this.config.update(), s.on.transitionstart((i) => {
        this.attribute.open ? this.send("_open_start") : this.send("_close_start");
      }), s.on.transitionend((i) => {
        this.attribute.open ? this.send("_close_end") : this.send("_open_end"), this.__.time = 0;
      }), this.#t.shadow.on.click((i) => {
        if (this.#t.shadow.contains(i.target) && i.target.closest(".toggle")) {
          this.toggle();
          return;
        }
        (i.target.closest("main") || !this.#t.shadow.contains(i.target) && !i.target.closest('[slot="side"]')) && this.close();
      });
    }
    get config() {
      return this.#t.config;
    }
    get shadow() {
      return this.#t.shadow;
    }
    get slots() {
      return this.#t.slots;
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
);
let l = null;
use.meta.ANVIL ? l = r({ id: "frame" }) : l = r({ id: "frame", parent: d });
export {
  l as frame
};

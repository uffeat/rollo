const { app: l, breakpoints: c, css: d, Mixins: m, author: g, component: e, mix: h } = await use("@/rollo/"), p = await use("@/bootstrap/reboot.css"), r = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg")
}, u = g(
  class extends h(HTMLElement, {}, ...m()) {
    #t = {};
    constructor() {
      super();
      const t = this, n = e.section(
        "side",
        e.button("toggle", {
          ariaLabel: "Close",
          innerHTML: r.close
        }),
        e.slot({ name: "side" })
      ), o = e.div(
        { id: "root" },
        e.header(
          e.slot({ name: "home" }),
          e.button("toggle", {
            ariaLabel: "Toggle",
            innerHTML: r.menu
          }),
          e.section(e.slot({ name: "top" }))
        ),
        e.section("main", n, e.main(e.slot())),
        e.footer()
      );
      this.attachShadow({ mode: "open" }).append(o), p.use(this), d`
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
        @media (${"width >= "}${c.md}px) {
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
          /* Defaults */
          easing: i = "ease-in-out",
          time: s = "200ms",
          width: a = "300px"
        } = {}) {
          t.__.easing = i, t.__.width = a, t.attribute.time = s, t.send("_config", { detail: { easing: i, time: s, width: a } });
        }
      }(), this.config.update(), n.on.transitionstart((i) => {
        this.attribute.open ? this.send("_open_start") : this.send("_close_start");
      }), n.on.transitionend((i) => {
        this.attribute.open ? this.send("_close_end") : this.send("_open_end"), this.__.time = 0;
      }), o.on.click((i) => {
        if (o.contains(i.target) && i.target.closest(".toggle")) {
          this.toggle();
          return;
        }
        (i.target.closest("main") || !o.contains(i.target) && !i.target.closest('[slot="side"]')) && this.close();
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
), b = u({ id: "frame", parent: l });
export {
  b as frame
};

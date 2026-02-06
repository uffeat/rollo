import "../use";

const { app, breakpoints, css, Mixins, author, component, mix } =
  await use("@/rollo/");

/* Get shadow sheets */
const reboot = await use("@/bootstrap/reboot.css");

const icons = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg"),
};

const Frame = author(
  class extends mix(HTMLElement, {}, ...Mixins()) {
    #_ = {};
    constructor() {
      super();
      const owner = this;

      /* Build shadow */
      const side = component.section(
        "side",
        component.button("toggle", {
          ariaLabel: "Close",
          innerHTML: icons.close,
        }),
        component.slot({ name: "side" }),
      );
      const shadow = component.div(
        { id: "root" },
        component.header(
          component.slot({ name: "home" }),
          component.button("toggle", {
            ariaLabel: "Toggle",
            innerHTML: icons.menu,
          }),
          component.section(component.slot({ name: "top" })),
        ),
        component.section("main", side, component.main(component.slot())),
        component.footer(),
      );
      this.attachShadow({ mode: "open" }).append(shadow);
      reboot.use(this);
      css`
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
        @media (${"width >= "}${breakpoints.md}px) {
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
      `.use(this);

      /* Config */
      this.#_.config = new (class {
        get easing() {
          return owner.__.easing;
        }

        get time() {
          return owner.attribute.time;
        }

        get width() {
          return owner.__.width;
        }

        update({
          /* Defaults */
          easing = "ease-in-out",
          time = "200ms",
          width = "300px",
        } = {}) {
          /* NOTE Store config items on components to avoid holding private 
          values and to provide an alternative way to config, i.e., directly 
          on component. */
          owner.__.easing = easing;
          owner.__.width = width;
          owner.attribute.time = time;
          /* Notify re config change */
          owner.send("_config", { detail: { easing, time, width } });
        }
      })();
      this.config.update();

      /* Transition events */
      side.on.transitionstart((event) => {
        if (!this.attribute.open) {
          this.send("_close_start");
        } else {
          this.send("_open_start");
        }
      });
      side.on.transitionend((event) => {
        if (this.attribute.open) {
          this.send("_close_end");
        } else {
          this.send("_open_end");
        }
        /* Reset 'time' CSS var to side action during resize */
        this.__.time = 0;
      });

      /* Open/close click control */
      shadow.on.click((event) => {
        /* Click close control in shadow -> toggle */
        if (shadow.contains(event.target) && event.target.closest(".toggle")) {
          this.toggle();
          return;
        }
        /* Click main area in shadow -> close
        Click external component not in side slot -> close */
        if (
          event.target.closest("main") ||
          (!shadow.contains(event.target) &&
            !event.target.closest('[slot="side"]'))
        ) {
          this.close();
        }
      });
    }

    get config() {
      return this.#_.config;
    }

    close(smooth = true) {
      if (smooth) {
        /* Restore config time */
        this.__.time = this.config.time;
      }
      this.attribute.open = false;
    }

    open(smooth = true) {
      if (smooth) {
        /* Restore config time */
        this.__.time = this.config.time;
      }
      this.attribute.open = true;
    }

    toggle(smooth = true) {
      if (smooth) {
        /* Restore config time */
        this.__.time = this.config.time;
      }
      this.attribute.open = !this.attribute.open;
    }
  },
  "frame-component",
);

export const frame = Frame({ id: "frame", parent: app });

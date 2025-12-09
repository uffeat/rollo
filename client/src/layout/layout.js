import "@/use.js";
import { app } from "@/app/app.js";
import { Mixins, author, component, mix } from "@/component/component.js";
import "@/layout/layout.css";

/* Get shadow sheets */
const reboot = await use("@/bootstrap/reboot.css");
const shadow = use.meta.DEV ?  await use("/assets/layout/shadow.css", { as: "sheet" }) : await use(`@/layout/shadow.css`);

const icons = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg"),
};

const Layout = author(
  class extends mix(HTMLElement, {}, ...Mixins()) {
    #_ = {
      tree: {},
    };
    constructor() {
      super();

      this.#_.shadow = component.div(
        { id: "root" },
        component.header(
          component.slot({ name: "home" }),
          component.button("_close", {
            ariaLabel: "Toggle",
            innerHTML: icons.menu,
          }),
          component.section(component.slot({ name: "top" }))
        ),
        component.section(
          "_main",
          component.section(
            "_side",
            component.button("_close", {
              ariaLabel: "Close",
              innerHTML: icons.close,
            }),
            component.slot({ name: "side" })
          ),
          component.main(component.slot())
        ),
        component.footer()
      );

      this.attachShadow({ mode: "open" }).append(this.shadow);
      reboot.use(this);
      shadow.use(this);

      /* Config */
      this.#_.config = new (class Config {
        #_ = {};

        constructor(owner) {
          this.#_.owner = owner;
        }

        get owner() {
          return this.#_.owner;
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
          easing = "ease-in-out",
          time = "200ms",
          width = "300px",
        } = {}) {
          this.owner.__.easing = easing;
          this.owner.__.width = width;
          this.owner.attribute._time = time;
          this.owner.send("_config", { detail: { easing, time, width } });
        }
      })(this);

      this.config.update();

      /* Responsiveness */
      (() => {
        const query = window.matchMedia("(width >= 768px)");
        /* Handle initial */
        if (query.matches) {
          this.classes.add("_md");
          this.send("_md", { detail: true });
        } else {
          this.send("_md", { detail: false });
        }
        query.addEventListener("change", (event) => {
          if (event.matches) {
            this.classes.add("_md");
            this.send("_md", { detail: true });
          } else {
            this.classes.remove("_md");
            this.send("_md", { detail: false });
          }
        });
      })();

      /* Tree */
      this.tree.header = this.shadow.find("header");
      this.tree.side = this.shadow.find("section._side");
      this.tree.slot = this.shadow.find("main>slot");
      this.tree.main = this.shadow.find("main");
      this.tree.header = this.shadow.find("header");

      /* Open/close control */
      (() => {
        /* Transition events */
        this.tree.side.addEventListener("transitionstart", (event) => {
          if (this.classes.has("_close")) {
            this.send("_close_start");
          } else {
            this.send("_open_start");
          }
        });
        this.tree.side.addEventListener("transitionend", (event) => {
          if (this.classes.has("_close")) {
            this.send("_close_end");
          } else {
            this.send("_open_end");
          }
          this.__.time = 0;
        });

        /* Click control */
        this.shadow.on.click = (event) => {
          /* Click close control in shadow -> toggle */
          if (
            this.shadow.contains(event.target) &&
            event.target.closest("._close")
          ) {
            this.toggle();
            return;
          }
          /* Click main area in shadow -> close
          Click external component not in side slot -> close */
          if (
            event.target.closest("main") ||
            (!this.shadow.contains(event.target) &&
              !event.target.closest('[slot="side"]'))
          ) {
            this.close();
          }
        };
      })();

      this.#_.observer = new (class Observer {
        #_ = {
          observers: {},
        };

        constructor(owner) {
          this.#_.owner = owner;

          /* NOTE Using 'setTimeout' inside observer callbacks to relegate work to 
          next macro task. This is a trick to suppress the (harmless) warning shown
          in Chromium browsers: 
            'ResizeObserver loop completed with undelivered notifications'. */

          this.#_.observers.header = new ResizeObserver((entries) => {
            setTimeout(() => {
              for (const entry of entries) {
                const top = this.owner.tree.header.clientHeight;
                this.owner.attribute._top = top;
                this.owner.send("_header_resize", { detail: { top } });
              }
            }, 0);
          });
          this.#_.observers.main = new ResizeObserver((entries) => {
            setTimeout(() => {
              for (const entry of entries) {
                const width = entry.contentRect.width;
                this.owner.attribute._width = width;
                const height = entry.contentRect.height;
                this.owner.attribute._height = height;
                this.owner.send("_main_resize", { detail: { width, height } });
              }
            }, 0);
          });
        }

        get owner() {
          return this.#_.owner;
        }

        start() {
          console.log("Starting observer"); ////

          this.#_.observers.header.observe(this.owner.tree.header);
          this.#_.observers.main.observe(this.owner.tree.main);
          this.owner.attribute._observes = true;
          return this.owner;
        }

        stop() {
          this.#_.observers.header.disconnect();
          this.#_.observers.main.disconnect();
          this.owner.attribute._observes = false;
          return this.owner;
        }
      })(this);
    }

    /* Exposes current size data as attributes. */
    connectedCallback() {
      const top = this.tree.header.clientHeight;
      this.attribute._top = top;
      const width = this.tree.main.getBoundingClientRect().width;
      this.attribute._width = width;
      const height = this.tree.main.getBoundingClientRect().height;
      this.attribute._height = height;
    }

    get config() {
      return this.#_.config;
    }

    get observer() {
      return this.#_.observer;
    }

    get shadow() {
      return this.#_.shadow;
    }

    get tree() {
      return this.#_.tree;
    }

    close(smooth = true) {
      if (smooth) {
        this.__.time = this.config.time;
      }
      this.classes.add("_close");
    }

    open(smooth = true) {
      if (smooth) {
        this.__.time = this.config.time;
      }
      this.classes.remove("_close");
    }

    toggle(smooth = true) {
      if (smooth) {
        this.__.time = this.config.time;
      }
      this.classes.toggle("_close");
    }
  },
  "layout-component"
);

export const layout = Layout({ id: "layout", parent: app });

import "../use";

const { app } = await use("@/rollo/");
const { Mixins, author, component, mix } = await use("@/rollo/");

/* Get shadow sheets */
const reboot = await use("@/bootstrap/reboot.css");
const shadow = await use(`@/frame/shadow.css`, { auto: true });

const icons = {
  close: await use("@/icons/close.svg"),
  menu: await use("@/icons/menu.svg"),
};

const Frame = author(
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
    }

    get config() {
      return this.#_.config;
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
  "frame-component"
);

export const frame = Frame({ id: "frame", parent: app });

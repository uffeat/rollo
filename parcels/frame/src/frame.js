import "../use";

const { app } = await use("@/rollo/");
const { Mixins, author, component, mix } = await use("@/rollo/");

/* Get shadow sheets */
const reboot = await use("@/bootstrap/reboot.css");
const shadowSheet = await use(`@/frame/shadow.css`, { auto: true });

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
        component.slot({ name: "side" })
      );
      const shadow = component.div(
        { id: "root" },
        component.header(
          component.slot({ name: "home" }),
          component.button("toggle", {
            ariaLabel: "Toggle",
            innerHTML: icons.menu,
          }),
          component.section(component.slot({ name: "top" }))
        ),
        component.section("main", 
          side, 
          component.main(component.slot())),
        component.footer()
      );
      this.attachShadow({ mode: "open" }).append(shadow);
      reboot.use(this);
      shadowSheet.use(this);

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
          values and to private an alternative way to config, i.e., directly 
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
  "frame-component"
);

export const frame = Frame({ id: "frame", parent: app });

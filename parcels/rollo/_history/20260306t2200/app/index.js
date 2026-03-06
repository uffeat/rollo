import "../../use";
import { Mixins, author, component, mix } from "../component/index";
import { stateMixin } from "../state/index";

export const breakpoints = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
});

const App = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {};
    constructor() {
      super();
      this.#_.slots = Object.freeze({
        default: component.slot(),
        data: component.slot({ name: "data" }),
        iworker: component.slot({ name: "iworker" }),
      });

      this.#_.shadow = component.div(
        { id: "root" },
        this.slots.default,
        this.slots.data,
        this.slots.iworker,
      );
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.attribute.app = true;
      this.attribute.webComponent = true;

      const observer = new ResizeObserver((entries) => {
        // HACK Wrap in 'setTimeout' to suppress Chromium warning.
        setTimeout(() => {
          for (const entry of entries) {
            const X = entry.contentRect.width;
            const Y = entry.contentRect.height;
            // Use uppercase to avoid collision with native style props 'x' and 'y';
            // translates to attrs: `state-x` and `state-y`.
            // Update state with function (batch) to minimize effect calls.
            this.$({ X, Y });
          }
        }, 0);
      });
      observer.observe(this);
      // State -> event dispatch. Send events from effect to avoid redundant
      // sending of x/y-specific events.
      this.$.effects.add(
        (change) => {
          const { X, Y } = change;
          this.send("_resize");
          if (X !== undefined) {
            this.send("_resize_x", { detail: X });
          }
          if (Y !== undefined) {
            this.send("_resize_y", { detail: Y });
          }
        },
        ["X", "Y"],
      );

      for (const [key, value] of Object.entries(breakpoints)) {
        const query = window.matchMedia(`(width >= ${value}px)`);
        // Handle initial
        const match = query.matches;
        this.$[key] = match;
        this.send(`_break_${key}`, { detail: match });
        query.addEventListener("change", (event) => {
          const match = query.matches;
          this.$[key] = match;
          this.send(`_break_${key}`, { detail: match });
        });
      }
    }

    get shadow() {
      return this.#_.shadow;
    }

    get slots() {
      return this.#_.slots;
    }
  },
  "app-component",
);

export const app = App({ id: "appGoesHere" });

if (use.meta.ANVIL) {
  const appGoesHere = document.getElementById("appGoesHere");
  if (appGoesHere) {
    appGoesHere.replaceWith(app);
  } else {
    document.body.prepend(app);
  }
} else {
  document.body.prepend(app);
}


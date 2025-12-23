/* Intermediary for Plotly. */
import "./plotly.css";
import { Plotly } from "./plotly.js";

const { app, Mixins, stateMixin, author, component, mix, css, element } =
  await use("@/rollo/");

export { Plotly };

/* Map trace colors to Bootstrap. */
export const colorway = Object.freeze([
  css.root.bsBlue,
  css.root.bsGreen,
  css.root.bsPink,
  css.root.bsIndigo,
  css.root.bsTeal,
  css.root.bsOrange,
  css.root.bsYellow,
]);

/* Returns component that wraps a Plotly plot.
The component creates and disposes of the plot in accordance with the component 
connect LC. If this is too much "mount/unmont" either keep the component connected,
or roll your own.
Goodies:
- Sheet-styles for dark-mode (Rollo default).
- Patches up 'layout' with defaults that match sheet styling.
- Piggybacks on app components resize observer to provide responsive plots
  (much better than Plotly's built-in 'responsive' config).
- Integrates Plotly-specifics into Rollo-components' standard 'update' method,
  but also exposes a 'traces' controller for trace-specific stuff.
*/
export const Plot = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {};

    constructor() {
      super();
      const owner = this;
      /* NOTE Plotly needs a plain HTML element (to absolutely demolish :-)) */
      this.#_.container = element.div();
      this.#_.onresize = (event) => {
        Plotly.Plots.resize(this.#_.container);
      };

      this.#_.traces = new (class {
        add(updates) {
          Plotly.addTraces(owner.container, updates);
        }

        remove(index) {
          Plotly.deleteTraces(owner.container, index);
        }

        update(index, updates) {
          /* Wrap array values in an outer array so Plotly applies them to 
          the one trace only; e.g., { y: [1,2,3] } -> { y: [[1,2,3]] } for a single trace. */
          const wrapped = {};
          for (const [key, value] of Object.entries(updates)) {
            if (Array.isArray(value)) {
              /* If it already looks like a "per-trace" list (single array item), 
              leave it as-is; otherwise wrap it so Plotly doesn't fan it out to other traces. */
              wrapped[key] =
                value.length === 1 && Array.isArray(value[0]) ? value : [value];
              continue;
            }
            /* Non-array values can pass through unchanged. */
            wrapped[key] = value;
          }
          Plotly.restyle(owner.container, wrapped, index);
        }
      })();
    }

    /* Returns container child. 
    NOTE Can be used in combination with 'Plotly' to do stuff that this component 
    does not support while still taking advantage of component features. */
    get container() {
      return this.#_.container;
    }

    get layout() {
      return this.#_.layout;
    }

    set layout(layout) {
      if (layout) {
        const L = layout ?? {};
        L.colorway ??= colorway;
        L.font ??= {};
        L.font.color ??= css.root.bsLight;

        if (this.isConnected) {
          Plotly.relayout(this.#_.container, layout);
        } else {
          this.#_.layout = layout;
        }
      }
    }

    /* Returns controller for traces. */
    get traces() {
      return this.#_.traces;
    }

    connectedCallback() {
      super.connectedCallback?.();

      Plotly.newPlot(
        this.#_.container,
        this.#_.data,
        this.#_.layout,
        this.#_.config
      );

      requestAnimationFrame(() => {
        Plotly.Plots.resize(this.#_.container);
      });

      app.addEventListener("_resize_x", this.#_.onresize);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      Plotly.purge(this.#_.container);
      app.removeEventListener("_resize_x", this.#_.onresize);
    }

    __new__(...args) {
      super.__new__?.(...args);
      this.append(this.#_.container);
    }

    /* Updates component and handles special Plotly related items. */
    update({ config, data, layout, ...updates } = {}) {
      /* Handle plot items before super.update to ensure it's done before connect */

      if (this.isConnected) {
        if (layout) {
          this.layout = layout;
        }

        if (config || data) {
          /* Update plot 
          NOTE Use `traces` for more fine-grained control. */
          Plotly.react(
            this.#_.container,
            data || this.#_.data,
            config || { displaylogo: false }
          );
        }
      } else {
        /* New plot (creacted when connected) */
        this.#_.config = config || { displaylogo: false };
        this.#_.data = data ?? [];
        this.#_.layout = layout ?? {};
      }

      super.update?.(updates);
    }
  },
  "plotly-component"
);

/* "Middleware" for Plotly. */
import "./plotly.css";
import { Plotly } from "./plotly.js";
import { Axis, Layout } from "./tools/layout";
import { Traces } from "./tools/traces";

const { Exception, Mixins, app, author, element, freeze, mix, stateMixin } =
  await use("@/rollo/");

/* Returns component that wraps a Plotly plot.
The component creates and disposes responsive plot in accordance with the component 
connection LC, but retains all other state across LC. 
Goodies:
- Sheet-styles for dark-mode (Rollo default).
- 'Layout' defaults that match sheet styling.
- Piggybacks on app components resize observer to provide responsive plots
  (much better than Plotly's built-in 'responsive' config).
- Integrates Plotly-specifics into Rollo-components' standard 'update' method,
  but also exposes a 'traces' controller for trace-specific stuff and `relayout`
  for layout updates.
NOTE
- To decouple from connection LC keep component connected or roll custom.
*/
const Plot = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {
      config: {
        displaylogo: false,
      },
      data: [],
      layout: Layout(),
    };

    constructor() {
      super();
      const owner = this;
      /* NOTE Plotly needs a plain HTML element (to absolutely demolish :-)) */
      this.#_.container = element.div();
      this.#_.onresize = (event) => {
        Plotly.Plots.resize(this.#_.container);
      };
      this.#_.plotly = new Proxy(() => {}, {
        get(target, key) {
          return (...args) => {
            return Plotly[key](owner.#_.container, ...args);
          };
        },
      });
    }

    /* Returns container child. 
    NOTE Can be used in combination with 'Plotly' to do stuff that this component 
    does not support, while still taking advantage of component features. */
    get container() {
      return this.#_.container;
    }

    /* Returns frozen copy of config. */
    get config() {
      return freeze(structuredClone(this.#_.config));
    }

    /* Returns frozen copy of data. */
    get data() {
      return freeze(structuredClone(this.#_.data));
    }

    /* Returns frozen copy of layout. */
    get layout() {
      return freeze(structuredClone(this.#_.layout));
    }

    /* Returns controller, from which Plotly methods can be called with container 
    implicitly passed as first arg. 
    NOTE Sugar and useful for doing stuff beyond component features. */
    get plotly() {
      return this.#_.plotly;
    }

    /* Returns controller for traces. */
    get traces() {
      Exception.if(
        !this.#_.traces,
        `Traces not available. Did you provide 'data'?`
      );
      Exception.if(
        !this.isConnected,
        `Traces not available, when disconnected.`
      );
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
      /* Alt: this.plotly.newPlot(this.#_.data, this.#_.layout, this.#_.config); */
      /* Initial sizing; requestAnimationFrame reduces flickering risk. */
      requestAnimationFrame(() => {
        Plotly.Plots.resize(this.#_.container);
      });
      /* Responsiveness */
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

    /* Updates layout. */
    relayout(updates) {
      Exception.if(
        !this.isConnected,
        `'relayout' not avilable, when disconnected.`
      );
      Plotly.relayout(this.#_.container, updates);
      return this;
    }

    /* Updates component and handles special Plotly related items. */
    update({ config, data, layout, ...updates } = {}) {
      /* Handle plot items before updating other items to ensure it's done before connect */
      if (config) {
        this.#_.config = config;
      }
      if (data) {
        this.#_.data = data;
        this.#_.traces = new Traces(this, this.#_.data);
      }
      if (layout) {
        this.#_.layout = layout;
      }
      if (this.isConnected) {
        Plotly.react(
          this.#_.container,
          this.#_.data,
          this.#_.layout,
          this.#_.config
        );
      }
      super.update?.(updates);
      return this;
    }
  },
  "plotly-component"
);

export { Axis, Layout, Plot, Plotly };

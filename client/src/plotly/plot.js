import { Layout } from "./tools/layout";
import { Traces } from "./tools/traces";

const {
  Exception,
  Mixins,
  app,
  author,
  component,
  element,
  freeze,
  mix,
  stateMixin,
} = await use("@/rollo/");

//
//

//
//

//
//
const Plotly = (() => {
  let result;
  return async () => {
    if (!result) {
      result = (await use("/plotly/")).Plotly;
    }
    return result;
  };
})();
//
//

const Factory = author(
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

      /* NOTE Plotly needs a plain HTML element (to absolutely demolish :-)) */
      this.#_.container = element.div();
      this.#_.onresize = (event) => {
        this.resize();
      };

      this.#_.spinner = component.div(
        component.div(
          "spinner-border",
          { role: "status" },
          component.span("visually-hidden", "Loading...")
        )
      );
    }

    setup(Plotly, ...args) {
      this.#_.Plotly = Plotly;

      const owner = this;
      this.#_.plotly = new Proxy(() => {}, {
        get(target, key) {
          return (...args) => {
            return Plotly[key](owner.#_.container, ...args);
          };
        },
      });

      return this.update(...args);
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
      Exception.if(!this.#_.traces, `Traces not yey available,`);
      Exception.if(!this.isConnected, `Not DOM-connected.`);
      return this.#_.traces;
    }

    connectedCallback() {
      super.connectedCallback?.();
      this.#_.Plotly.newPlot(
        this.#_.container,
        this.#_.data,
        this.#_.layout,
        this.#_.config
      );

      /* Initial sizing; requestAnimationFrame mitigates flickering. */
      requestAnimationFrame(() => {
        this.resize();
      });
      /* Responsiveness */
      app.addEventListener("_resize_x", this.#_.onresize);
    }

    disconnectedCallback() {
      super.disconnectedCallback?.();
      this.#_.Plotly.purge(this.#_.container);
      app.removeEventListener("_resize_x", this.#_.onresize);
    }

    __new__(...args) {
      super.__new__?.(...args);
      this.append(this.#_.container);
    }

    /* Redraws plot. Call after mutation of Plotly-related items. */
    redraw() {
      Exception.if(!this.isConnected, `Not DOM-connected.`);
      this.#_.Plotly.redraw(this.#_.container);
      return this;
    }

    /* Updates plot layout. */
    relayout(updates) {
      Exception.if(!this.isConnected, `Not DOM-connected.`);
      this.#_.Plotly.relayout(this.#_.container, updates);
      return this;
    }

    /* Resizes plot. Call to force responsive sizing. */
    resize() {
      Exception.if(!this.isConnected, `Not DOM-connected.`);
      this.#_.Plotly.Plots.resize(this.#_.container);
      return this;
    }

    /* Updates component and handles special Plotly-related items. */
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
        this.#_.Plotly.react(
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

/* Returns component that wraps a Plotly plot.
The component creates and disposes responsive plot in accordance with the component 
connection LC, but retains state across LC. 
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
let P;
const Plot = (...args) => {
  const plot = Factory();

  if (P) {
    console.log("Plotly already loaded."); ////
    plot.setup(P, ...args);
    return plot;
  }

  const spinner = component.div('flex justify-center',
    component.div(
      "spinner-border !size-32 mt-8",
      { role: "status" },
      component.span("visually-hidden", "Loading...")
    )
  );
 

  plot.append(spinner);
  const { promise, resolve } = Promise.withResolvers();

  console.log("Loading Plotly..."); ////

  use("/plotly/").then((mod) => {
    const { Plotly } = mod;
    P = Plotly;
    plot.setup(P, ...args);

    console.log("Plot component setup completed"); ////

    resolve(plot);

    setTimeout(() => {
      spinner.remove();
    }, 0);
  });

  return promise;
};

export { Plot };

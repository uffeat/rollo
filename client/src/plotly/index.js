/* "Middleware" for Plotly. */
import "./plotly.css";
import { Plotly } from "./plotly.js";

const {
  app,
  Mixins,
  stateMixin,
  author,
  component,
  mix,
  css,
  element,
  deepFreeze,
  typeName,
} = await use("@/rollo/");

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
The component creates and disposes responsive plot in accordance with the component 
connection LC, but retains all other state across LC. 
Goodies:
- Sheet-styles for dark-mode (Rollo default).
- 'layout' defaults that match sheet styling.
- Piggybacks on app components resize observer to provide responsive plots
  (much better than Plotly's built-in 'responsive' config).
- Integrates Plotly-specifics into Rollo-components' standard 'update' method,
  but also exposes a 'traces' controller for trace-specific stuff.
NOTE
- To decouple from connection LC keep component connected or roll custom with
  Plotly and standard Rollo components.
*/
export const Plot = author(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {
      config: {
        displaylogo: false,
      },
      data: [],
      layout: {
        colorway,
        font: { color: css.root.bsLight },
      },
    };

    constructor() {
      super();
      const owner = this;
      /* NOTE Plotly needs a plain HTML element (to absolutely demolish :-)) */
      this.#_.container = element.div();
      this.#_.onresize = (event) => {
        Plotly.Plots.resize(this.#_.container);
      };

      this.#_.traces = new (class {
        get size() {
          return owner.#_.data.length;
        }

        /* Appends single trace */
        append(updates) {
          Plotly.addTraces(owner.container, updates);
          /* NOTE Plotly uses data, so a misguided attempt to "sync" with
          owner.#_.data.push(updates);
          ... would add the trace twice!
          */
          return owner;
        }

        /* Changes single trace.
        NOTE 
        - Intended as a lightweight alternative  to `update`. 
        - Partially created by Codex. */
        change(index, updates) {
          /* Mutates trace in-place and triggers a redraw. Avoids
          Plotly's restyle machinery (and its per-attribute array wrapping). */
          const trace = owner.#_.data[index];
          /* Iterative merge avoids recursion overhead and stack depth limits. */
          const stack = [[trace, updates]];
          while (stack.length) {
            const [target, source] = stack.pop();
            for (const key of Object.keys(source)) {
              const next = source[key];
              if (typeName(next) === "Object") {
                const current = target[key];
                if (typeName(current) === "Object") {
                  /* Merge into existing object to preserve references. */
                  stack.push([current, next]);
                } else {
                  /* Create a fresh object to receive the nested patch. */
                  const created = {};
                  target[key] = created;
                  stack.push([created, next]);
                }
                continue;
              }
              /* Arrays and scalars replace the current value. */
              target[key] = next;
            }
          }
          /* Redraw once after the in-place mutation. */
          Plotly.redraw(owner.container);
          return owner;
        }

        /* Returns index by name.
        NOTE Useful as a helper prior to using other 'traces' methods. */
        index(name) {
          let index = 0;
          for (const trace of owner.#_.data) {
            if (trace.name === name) {
              return index;
            }
            index++;
          }
          return null;
        }

        /* Inserts single trace */
        insert(index, updates) {
          Plotly.addTraces(owner.container, updates, index);
          /* NOTE Plotly uses data, so a misguided attempt to "sync" with
          owner.#_.data.push(updates);
          ... would add the trace twice!
          */
          return owner;
        }

        /* Prepends single trace */
        prepend(updates) {
          Plotly.prependTraces(owner.container, updates);
          return owner;
        }

        /* Removes single trace by index */
        remove(index) {
          Plotly.deleteTraces(owner.container, index);
          /* NOTE Plotly correctly mutates data, so no need to do:
          const data = owner.#_.data;
          for (let i = data.length - 1; i >= 0; i--) {
            if (i === index) {
              data.splice(i, 1);
            }
          }
          ... likely harmless, but redundant.
          */
          return owner;
        }

        /* Updates single trace */
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
          /* NOTE Plotly correctly mutates data, so no need to do:
          const trace = owner.#_.data.at(index);
          Object.assign(trace, updates);
          ... likely harmless, but redundant.
          */
          return owner;
        }
      })();

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
    does not support while still taking advantage of component features. */
    get container() {
      return this.#_.container;
    }

    /* Returns frozen copy of config.
    NOTE 
    - Mostly useful for DEV.
    - Deep copy to protect component internals.
    - Deep-frozen as a signal to consuming code that mutation does not affect 
      component. */
    get config() {
      return deepFreeze(structuredClone(this.#_.config));
    }

    /* Returns frozen copy of data.
    NOTE 
    - Mostly useful for DEV.
    - Deep copy to protect component internals.
    - Deep-frozen as a signal to consuming code that mutation does not affect 
      component. */
    get data() {
      return deepFreeze(structuredClone(this.#_.data));
    }

    /* Returns frozen copy of layout.
    NOTE 
    - Mostly useful for DEV.
    - Deep copy to protect component internals.
    - Deep-frozen as a signal to consuming code that mutation does not affect 
      component. */
    get layout() {
      return deepFreeze(structuredClone(this.#_.layout));
    }

    /* Returns controller, from which Plotly methods can be called with container 
    implicitly passed as first arg. 
    NOTE Sugar and useful for doing stuff beyond component features. */
    get plotly() {
      return this.#_.plotly;
    }

    /* Returns controller for traces. 
    NOTE Safest to use on connected component. */
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

    /* Updates component and handles special Plotly related items. */
    update({ config, data, layout, ...updates } = {}) {
      /* Handle plot items before super.update to ensure it's done before connect */
      Object.assign(this.#_.config, config);
      Object.assign(this.#_.layout, layout);
      if (data) {
        this.#_.data = data;
      }

      if (this.isConnected) {
        if (!config && !data && layout) {
          /* Update layout only */
          Plotly.relayout(this.#_.container, layout);
        } else {
          /* Update plot 
          NOTE Use `traces` for more fine-grained control. */
          Plotly.react(
            this.#_.container,
            this.#_.data,
            this.#_.layout,
            this.#_.config
          );
        }
      } else {
        /* Do nothing. New plot created when connected */
      }

      super.update?.(updates);
      return this;
    }
  },
  "plotly-component"
);





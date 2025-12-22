/* Intermediary for `/public/plotly/plotly.js` that adds
extras, loads plotly.js, and injects into import engine.
Doing this directly in  `/public/plotly/plotly.js` would be unwieldy
as the file is heavy and VS Code struggles to lint. */

const { css } = await use("@/rollo/");

/* Map trace colors to Bootstrap
NOTE Slight initial overhead; could be moved to setup for laziness. */
const colorway = Object.freeze([
  css.root.bsBlue,
  css.root.bsGreen,
  css.root.bsPink,
  css.root.bsIndigo,
  css.root.bsTeal,
  css.root.bsOrange,
  css.root.bsYellow,
]);

let result;
let constructing;

const setup = async () => {
  await use("//plotly.css");
  const { Plotly } = await use("/plotly/");

  /* Collection of methods that supplements/"overloads" Plotly */
  const overload = new (class {
    create(container, ...figure) {
      /* NOTE Plotly throws an error, if resize is called on a non-connected 
      container. */
      if (container.isConnected) {
        Plotly.newPlot(container, ...figure).then(() => {
          requestAnimationFrame(() => Plotly.Plots.resize(container));
        });
      } else {
        Plotly.newPlot(container, ...figure);
      }
    }

    dispose(container) {
      Plotly.purge(container);
    }

    refresh(container) {
      /* NOTE Plotly throws an error, if resize is called on a non-connected 
      container. */
      if (container.isConnected) {
        Plotly.Plots.resize(container);
      }
    }
  })();

  return new Proxy(
    {},
    {
      get(target, key) {
        if (Object.hasOwn(overload.constructor.prototype, key))
          return overload[key];
        return Plotly[key];
      },
    }
  );
};

/* Set up alias for import engine */
use.add("@/plotly.js", async () => {
  if (result) return result;
  if (constructing) return constructing;
  constructing = (async () => {
    result = Object.freeze({ Plotly: await setup(), colorway });
    constructing = null;
    return result;
  })();

  return constructing;
});

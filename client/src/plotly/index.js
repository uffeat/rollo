/* . */
import { Plotly } from "./plotly";

const { css } = await use("@/rollo/");

await use("//plotly.css");

/* Map trace colors to Bootstrap
NOTE Slight initial overhead; could be moved to setup for laziness. */
export const colorway = Object.freeze([
  css.root.bsBlue,
  css.root.bsGreen,
  css.root.bsPink,
  css.root.bsIndigo,
  css.root.bsTeal,
  css.root.bsOrange,
  css.root.bsYellow,
]);

export const plotly = new (class {
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

export { Plotly };

const { component, element, css } = await use("@/rollo/");

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
  const instance = new (class {
    create(container, ...figure) {
      Plotly.newPlot(container, ...figure).then(() => {
        requestAnimationFrame(() => Plotly.Plots.resize(container));
      });
    }
  })();

  return new Proxy(
    {},
    {
      get(target, key) {
        if (Object.hasOwn(instance.constructor.prototype, key)) return instance[key];
        /* Alt:
        if (key in instance) return instance[key]
        */
        return Plotly[key];
      },
    }
  );
};

/* Set up alias for import engine */
use.add("@/plotly.js", async () => {
  if (result) return result
  if (constructing) return constructing;
  constructing = (async () => {
    result  = Object.freeze({ Plotly: await setup(), colorway });
    constructing = null;
    return result;
  })();

  return constructing;
});

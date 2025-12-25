/* 
/plotly/bar.test.js
*/
import { Axis, Plot, Layout } from "@/plotly";

const { component, router, NavLink } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const route = new (class {
  #_ = {};

  constructor() {
    const x = ["Zebras", "Lions", "Pelicans"];
    const type = "bar";
    const Trace = (name, y) => ({ x, y, type, name });

    const buttonStyle = "btn.btn-primary";

    const plot = Plot({
      data: [
        Trace("New York", [90, 40, 60]),
        Trace("San Francisco", [10, 80, 45]),
      ],
      layout: {
        xaxis: Axis("Animal"),
        yaxis: Axis("Population"),
        ...Layout(),
      },
    });

    /* Here's an example of 'non-partially' updating layout. It would be more 
    efficient to use `plot.relayout`, but this is just to demo the use of 'update'. */
    plot.update({
      layout: {
        xaxis: Axis("Name of animal"),
        yaxis: Axis("How many we have"),
        ...Layout(),
      },
      /* If we want to signal that config and data should not be touched, we could (redundantly) do: */
      data: null,
      config: null,
    });

    /* Here's an example of 'non-partially' updating data. It would be more 
    efficient to use `plot.taces`, but this is just to demo the use of 'update'. */
    plot.update({
      data: [
        Trace("New York", [10, 40, 90]),
        Trace("San Francisco", [90, 40, 10]),
      ],
    });

    /* Here's an example of an initial update without any plotly-related items.
    It really does not make any sense, but it proves that default values prevents errors */
    const plot2 = Plot();

    this.#_.page = component.main(
      "container pt-3",
      component.h1({ text: "Bar plot" }),
      component.menu(
        "flex justify-end flex-wrap gap-3 me-3",
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.relayout({ yaxis: Axis("Number") });
              //console.log("layout:", plot.layout); ////
            },
          },
          "Change layout"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.append(Trace("Copenhagen", [10, 20, 40]));
            },
          },
          "Append Copenhagen"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.update("New York", { y: [60, 90, 60] });
            },
          },
          "Update New York"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.remove("San Francisco");
            },
          },
          "Remove San Francisco"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              plot.traces.change("New York", { y: [40, 40, 40] });
              console.log("plot.data:", plot.data);
            },
          },
          "Change New York"
        ),
        component.button(
          buttonStyle,
          {
            "on.click": (event) => {
              const index = plot.traces.index("Copenhagen");
              console.log("index:", index);
            },
          },
          "Find Copenhagen index"
        )
      ),
      plot,
      plot2
    );

    /* Here's an example of a "late update" (strict) of plotly-related items.
    Not the standard way to do it, but it can be done smoothly. */
    plot2.update({
      data: [Trace("Stockholm", [20, 40, 30])],
      layout: {
        xaxis: Axis("Animal"),
        yaxis: Axis("Population"),
        ...Layout(),
      },
    });
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {}

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  async exit(meta) {
    this.page.remove();
  }
})();

export default () => {
  /* Add route */
  router.routes.add(`/plotly-bar`, route);
  const link = NavLink("nav-link", {
    text: "Plotly bar plot",
    path: `/plotly-bar`,
    title: "Plotly bar plot",
    slot: "side",
  });
  /* Inject link into existing nav group to exploit active state management. */
  const nav = frame.find(`.nav[slot="side"]`);
  nav.append(link);
};

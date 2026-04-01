import "../../../use";

const { Route } = await use("@/router/");
const { Bar } = await use("@/plotly/");
const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Spinner } = await use("/tools/spinner");

const route = new (class extends Route {
  #_ = {};

  constructor() {
    super({
      page: component.main(
        "container pt-3",
        component.h1({ text: "Bar chart" }),
      ),
    });
  }

  async enter() {
    frame.clear(":not([slot])");
    frame.append(this.page);

    if (!this.#_.plot) {
      const spinner = Spinner({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem",
      });

      this.#_.plot = await Bar(
        {
          xaxis: "Animal",
          yaxis: "Population",
          x: ["Zebras", "Lions", "Pelicans"],
        },
        /* Could also do:
        { "New York": [90, 40, 60] },
        { "San Francisco": [10, 80, 45] }
        */
        { "New York": [90, 40, 60], "San Francisco": [10, 80, 45] },
      );
      spinner.remove();

      this.page.append(this.#_.plot);
    }
  }
})();

export { route as default };

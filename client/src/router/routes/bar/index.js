import "@/use";
import { Bar } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Bar chart" })
      );
    }
    return this.#_.page;
  }

  async setup(base) {
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
      { "New York": [90, 40, 60], "San Francisco": [10, 80, 45] }
    );

    this.page.append(this.#_.plot)

  }

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  async exit(meta) {
    this.page.remove();
  }
})();

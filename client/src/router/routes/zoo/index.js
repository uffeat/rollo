import "@/use";
import { Plot } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      const x = ["Zebras", "Lions", "Pelicans"]
      const type = "bar"
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Zoo" }),
        Plot({
          data: [
            {
              x,
              y: [90, 40, 60],
              type,
              name: "New York",
            },
            {
              x,
              y: [10, 80, 45],
              type,
              name: "San Francisco",
            },
          ],
          layout: {
            xaxis: {
              title: {
                text: "Animal",
              },
            },
            yaxis: {
              title: {
                text: "Population",
              },
            },
          },
        })
      );
    }
    return this.#_.page;
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();

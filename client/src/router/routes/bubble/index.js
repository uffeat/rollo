import "@/use";
import { Bubble } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Bubble chart" })
      );
    }
    return this.#_.page;
  }

  setup(base) {
    const plot = Bubble(
      {
        xaxis: "Business strength",
        yaxis: "Market attractiveness",
      },
      /* Could also do:
        { "Awesome": [[10, 10, 20], [20, 20, 30], [30, 30, 40], [40, 40, 50],] },
        { "Gnarly": [[10, 40, 10], [20, 30, 20], [30, 20, 30], [40, 10, 20],] }
        */
      {
        Awesome: [
          [10, 10, 20],
          [20, 20, 30],
          [30, 30, 40],
          [40, 40, 50],
        ],
        Gnarly: [
          [10, 40, 10],
          [20, 30, 20],
          [30, 20, 30],
          [40, 10, 20],
        ],
      }
    );
    this.page.append(plot);
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();

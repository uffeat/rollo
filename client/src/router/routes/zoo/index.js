import "@/use";
import { Axis, Plot, Layout } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      const x = ["Zebras", "Lions", "Pelicans"];
      const type = "bar";
      const Trace = (name, y) => ({ x, y, type, name });
      
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Zoo" }),
        Plot({
          data: [
            Trace("New York", [90, 40, 60]),
            Trace("San Francisco", [10, 80, 45]),
          ],
          layout: {
            xaxis: Axis("Animal"),
            yaxis: Axis("Population"),
            ...Layout(),
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

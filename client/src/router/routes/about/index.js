import "@/use";
import { iworker } from "@/iworker";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main("container pt-3");
    }
    return this.#_.page;
  }

  async setup() {
    // TEST
    const text = await iworker.echo("About");
    this.page.append(component.h1({ text }));
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();

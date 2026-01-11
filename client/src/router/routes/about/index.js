import "@/use";
import { iworker } from "@/iworker";
//import { server } from "@/server";

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
    await (async () => {
      const text = await iworker.echo("About");
      this.page.append(component.h1({ text }));
    })();

    await (async () => {
      //const {result: text} = await server.echo("... stuff");
      //this.page.append(component.h2({ text }));
    })();
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();

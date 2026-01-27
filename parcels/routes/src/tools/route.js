import "../../use";

const { NavLink } = await use("@/router/");
const { frame } = await use("@/frame/");

export class Route {
  static create = (...args) => new Route(...args);

  #_ = {};

  constructor({ page, path, text } = {}) {
    this.#_.page = page;
    this.#_.path = path;
    this.#_.text = text;
  }

  get page() {
    return this.#_.page;
  }

  get path() {
    return this.#_.path;
  }

  get link() {
    return NavLink("nav-link", {
      text: this.text,
      path: this.path,
      title: this.text,
    });
  }

  get text() {
    return this.#_.text;
  }

  async setup(base) {}

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  update(meta, query, ...paths) {
    
  }

  async exit(meta) {
    this.page.remove();
  }
}

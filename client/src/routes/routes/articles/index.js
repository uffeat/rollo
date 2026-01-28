import "@/use";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { Articles } from "./articles.jsx";
import scopes from "./post.module.css";

const { component, toTop } = await use("@/rollo/");
const { Nav, NavLink, router, Route } = await use("@/router/");
const { frame } = await use("@/frame/");
const { nav } = await use("@/routes/");

const route = new (class extends Route {
  #_ = {};

  constructor() {
    super({
      page: component.main("container my-3"),
      path: "/articles",
    });
    this.#_.root = component.div({ "[root]": true, parent: this.page });
  }

  async setup(base) {
    /* Import and process pre-transpiled content. */
    const manifest = await use("@/content/blog/_manifest.json");
    const paths = manifest.map(([path, timestamp]) => path);

    const cards = [];
    const posts = {};
    for (let path of paths) {
      const item = await use(`@/content${path}.json`);
      path = `/${path.split("/").at(-1)}`;
      /* Build cards data to be rendered in React component */
      cards.push([path, item.meta]);
      /* Build post components
      NOTE Since posts data requires processing, post components are created here
      - for ref-insertion in React component. */
      const innerHTML = item.html;
      const post = component.div(scopes.post, { innerHTML });
      post.attribute.post = path;
      /* Replace images */
      for (const image of post.querySelectorAll(`img`)) {
        const src = image.getAttribute("src");
        if (src.startsWith("/")) {
          image.replaceWith(
            component.img({
              alt: image.getAttribute("alt"),
              src: `${use.meta.base}${src}`,
            }),
          );
        }
      }
      /* Replace links */
      for (const link of post.querySelectorAll(`a[href]`)) {
        const path = link.getAttribute("href");
        if (path.startsWith("/")) {
          link.parentElement.classList.add("nav");
          link.replaceWith(
            NavLink("nav-link", { path, text: link.textContent }),
          );
        }
      }
      post.on._connect((event) => toTop(post));
      posts[path] = post;
    }

    const reactRoot = createRoot(this.#_.root);
    reactRoot.render(
      createElement(Articles, { root: this.#_.root, cards, posts }),
    );
  }

  async enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
    /* Default to null, since undefined state is ignored */
    this.#_.root.$.post = paths.at(0) || null;
  }

  update(meta, query, ...paths) {
    /* Default to null, since undefined state is ignored */
    this.#_.root.$.post = paths.at(0) || null;
  }
})();

router.routes.add(route.path, route);

NavLink("nav-link", {
  text: "Articles",
  path: route.path,
  title: "Articles",
  parent: nav,
});

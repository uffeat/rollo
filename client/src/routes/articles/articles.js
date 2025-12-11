/*
src/routes/articles/articles.js
*/

import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { component } from "component";
import { layout } from "@/layout/layout";
import { NavLink } from "@/router/router";
import { toTop } from "@/tools/scroll";
import { Articles } from "./_articles.jsx";
import scopes from "./_post.module.css";

const root = component.div();
root.attribute.root = true;
const page = component.main("container my-3", root);

async function setup(base) {
  /* Always expose base path as page attr */
  page.attribute.page = base;

  /* Import static data.
  NOTE In the vanilla version, we can combine data retrieval and rendering
  ... but since rendering in this version is done in React, we need to
  first post-process the built static data. */
  const bundle = await use(`@/content/bundle/blog.json`);
  const paths = bundle.manifest.map(([path, timestamp]) => path);
  /* Build cards data to be rendered in React component */
  const cards = paths.map((path) => {
    return [path.slice("/blog".length), bundle.bundle[path].meta];
  });

  /* Build post components
  NOTE Since posts data requires processing post components are created here
  - for ref-insertion in React component. */
  const posts = Object.fromEntries(
    paths.map((path) => {
      const innerHTML = bundle.bundle[path].content;
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
            })
          );
        }
      }
      /* Replace links */
      for (const link of post.querySelectorAll(`a[href]`)) {
        const path = link.getAttribute("href");
        if (path.startsWith("/")) {
          link.parentElement.classList.add("nav");
          link.replaceWith(
            NavLink("nav-link", { path, text: link.textContent })
          );
        }
      }
      post.on._connect((event) => toTop(post));
      return [path.slice("/blog".length), post];
    })
  );

  const reactRoot = createRoot(root);
  reactRoot.render(createElement(Articles, { root, cards, posts }));
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
  /* Default to null, since undefined state is ignored */
  root.$.post = paths.at(0) || null;
}

function update(meta, query, ...paths) {
  /* Default to null, since undefined state is ignored */
  root.$.post = paths.at(0) || null;
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };

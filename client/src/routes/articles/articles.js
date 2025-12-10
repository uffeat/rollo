import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { component } from "component";
import { layout } from "@/layout/layout.js";

import { NavLink, router } from "@/router/router.js";
import { toTop } from "@/tools/scroll.js";
import { Articles } from "./articles.jsx";

const page = component.main("container my-3");

async function setup(base) {
  page.attribute.page = base;

  const bundle = await use(`@/content/bundle/blog.json`);
  const paths = bundle.manifest.map(([path, timestamp]) => path);
  const cardsData = paths.map((path) => {
    return [path.slice("/blog".length), bundle.bundle[path].meta];
  });
  //console.log("cardsData:", cardsData); ////

  const posts = Object.fromEntries(
    paths.map((path) => {
      const innerHTML = bundle.bundle[path].content;
      const post = component.div({ innerHTML });
      post.attribute.post = path;
      /* Replace images */
      for (const image of post.querySelectorAll(`img`)) {
        const src = image.getAttribute("src");
        if (src.startsWith("/")) {
          const alt = image.getAttribute("alt");
          const replacement = component.img({
            alt,
            src: `${use.meta.base}${src}`,
          });
          image.replaceWith(replacement);
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
      
      post.on._connect((event) => toTop(post))

      return [path.slice("/blog".length), post];
    })
  );
  //console.log("posts:", posts); ////

  const reactRoot = createRoot(page);
  reactRoot.render(createElement(Articles, { root: page, cardsData, posts }));
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
  /* Default to null, since undefined state is ignored */
  page.$.post = paths.at(0) || null;
}

function update(meta, query, ...paths) {
  /* Default to null, since undefined state is ignored */
  page.$.post = paths.at(0) || null;
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };

import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { ref } from "@/state/state.js";
import { router } from "@/router/router.js";
import { toTop } from "@/tools/scroll.js";
import { Articles } from "./articles.jsx";
import classes from "@/routes/articles/articles.module.css";

const page = component.main("container my-3");

const bundle = await use(`@/content/bundle/blog.json`);


const items = Object.entries(bundle.bundle).map(([k, v]) => {

  return [k.slice(5), v]

})

console.log('items:', items)

const reactRoot = createRoot(page);
reactRoot.render(createElement(Articles, { page, items }));

const state = ref();

function setup() {}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function update(meta, query, ...paths) {
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };

/* TODO
- Paginator component
- Prepare hooking into router by sending events
- Search feature
*/

import paths from '../data/paths.json'


import { PaginatorFactory } from "./paginator.js";

export const BlogFactory = async (use, Item) => {
  const { component } = await use("/component.js");
  const { Content } = await use("//content.js");
  const paginator = await PaginatorFactory(use);


  /* TODO
  - Get manifest as:  const manifest = await use("/content/manifest.json");
  */
  //const manifest = await use(`/blog/__manifest__.content`, { shape: "values" });
  //const paths = manifest.map(([path, created]) => path);
 

  const tree = {
    items: component.div(),
    page: component.div("container.pt-3.pb-3", { "[blog-page]": true }),
  };

  tree.items.attribute.blogItems = true;

  tree.page.append(paginator, tree.items);
  tree.page.attribute.page = true;

  const controller = new (class {
    #_ = { chunk: 4, index: 0 };

    constructor() {
      this.#_.size = paths.length;

      /* Render in the background without showing 
      TODO
      - Confirm that this does not block.
      */
      paths.forEach((path) => Item(path));

      paginator.on.click = async (event) => {
        if (event.target._action) {
          const action = event.target._action;
          await this[action]();
        }
      };

      /* Page from input
      TODO
      - For input, shift to 1-base */
      paginator.on.change = async (event) => {
        let page = event.target.value;
        if (page >= this.max) {
          page = this.max;
        } else if (page <= 0) {
          page = 0;
        }

        //console.log("page:", page); ////

        if (page !== this.page) {
          await this.#renderPage(page);
        }

        event.target.value = this.page;
      };
    }

    get chunk() {
      return this.#_.chunk;
    }

    get index() {
      return this.#_.index;
    }

    get max() {
      return Math.ceil(this.size / this.chunk) - 1;
    }

    get page() {
      return this.#_.page;
    }

    get size() {
      return this.#_.size;
    }

    async #renderIndex(index) {
      if (index < 0) {
        return new Error("under");
      }
      if (index > this.size - 1) {
        return new Error("over");
      }
      this.#_.index = index;
      const path = paths[index];
      const item = Item(path);

      //item.attribute.index = index;
      //item.attribute.page = this.page;

      /* Show item */
      item.attribute.current = true;

      tree.items.append(item);
      /* Render item components one at the time */
      const { promise, resolve } = Promise.withResolvers();
      item.attribute.ready
        ? resolve(true)
        : (item.on._ready = (event) => resolve(true));
      const result = await promise;
      return result;
    }

    async #renderPage(page) {
      console.log("page:", page); ////

      paginator.tree.previous.disabled = page <= 0;
      paginator.tree.next.disabled = page >= this.max;
      if (page < 0) {
        return new Error("under");
      }
      if (page > this.max) {
        return new Error("over");
      }
      this.#_.page = page;

      /* Sync to input
      TODO
      - For input, shift to 1-base */
      paginator.send("_page", { detail: page });
      /* Show current page index as attr */
      tree.items.attribute.page = page;

      const [start, end] = [
        page * this.chunk,
        Math.min(this.size, (page + 1) * this.chunk),
      ];

      //console.log("Rendering page:", page); ////
      //console.log("start:", start); ////
      //console.log("end:", end); ////

      /* Hide previous view */
      for (const item of tree.items.querySelectorAll("[blog-item][current]")) {
        item.attribute.current = false;
      }
      /* Show new view */
      //console.log("Starting loop..."); ////
      for (let index = start; index < end; index++) {
        //console.log("index in loop:", index);
        await this.#renderIndex(index);
      }
      //console.log(" "); ////
    }

    async next() {
      const page = this.page === undefined ? 0 : this.page + 1;
      await this.#renderPage(page);
    }

    async previous() {
      await this.#renderPage(this.page - 1);
    }
  })();

  /* Load first view */
  await controller.next();

  return ({ parent } = {}) => {
    if (parent && parent !== tree.page.parentElement) {
      parent.append(tree.page);
    }
    return tree.page;
  };
};

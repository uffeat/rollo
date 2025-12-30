import "@/use";
import { pop } from "@/tools/object";
import { items } from "./items";
import { Card } from "./card";
import { Post } from "./post";

const { Exception, component, toTop, router, NavLink } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  constructor() {
    this.#_.cards = component.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5"
    );
    this.#_.post = component.div();
    this.#_.page = component.main(
      "container my-3",
      this.#_.cards,
      this.#_.post
    );

    /* Render cards.
    NOTE Since 'cards' is image-rich, the component is rendered once and 
    related data removed from 'items'. */
    for (const path of items.keys()) {
      items.use(path).then((data) => {
        const [abstract, image, title] = pop(
          data,
          "abstract",
          "image",
          "title"
        );

        /* No more changes to data -> freeze */
        Object.freeze(data)


        const card = Card({ path, abstract, image, title });
        this.#_.cards.append(card);
      });
    }

    this.page.$.effects.add(
      (change, message) => {
        const previous = message.owner.previous.view;
        /* Remove any previous post */
        if (previous) {
          this.#_.post.detail.root.clear();
        }
        const current = change.view;
        if (current) {
          /* Post view -> undisplay cards */
          this.#_.cards.classes.add("hidden");
          const path = `/${current}`;
          items.use(path).then((data) => {
            const { html } = data;
            const post = Post({ html, path });
            this.#_.post.detail.root.append(post);
            toTop(post);
          });
        } else {
          /* Cards view -> display cards */
          this.#_.cards.classes.remove("hidden");
        }
      },
      { run: false },
      ["view"]
    );
  }

  get page() {
    return this.#_.page;
  }

  async setup(base) {
    

    this.page.on.click(async (event) => {
      event.preventDefault();
      const target = event.target;
      const link = target.tagName === "A" ? target : target.closest("a");
      if (link) {
        const card = target.closest(".card");
        if (card) {
          const path = card.attribute.path;
          await router(`${base}${path}`);
        }
      }
    });

    /* Set up shadow on this.#_.post. 
    NOTE The idea is to inject transpiled HTML into the shadow root.
    Could, alternatively, have used Vite's 'module.css' or 'css' imports
    to create a light-DOM sheet, which eliminate FOUC risk. However, the sheet 
    is small, so keep co-located. Importing/constructing sheets does carry
    a small cost, so done in 'setup'. */
    const { css } = await use("@/rollo/");
    const reboot = await use("@/bootstrap/reboot.css");
    const sheet = css`
      :is(h1, h2, h3, h4, h5, h6) {
        color: var(--bs-link-color);
      }

      img {
        max-width: 100%;
        min-width: 80%;
      }

      p:has(img) {
        display: flex;
        justify-content: center;
      }

      a {
        text-decoration: none;
        cursor: pointer;
      }

      a:hover {
        text-decoration: underline;
      }
    `;

    /* Create top-level root for shadow to avoid limitations of native shadow 
    root. */
    const root = component.div();
    this.#_.post.attachShadow({ mode: "open" });
    this.#_.post.shadowRoot.append(root);
    /* Add root to detail for easy access elsewhere */
    this.#_.post.detail.root = root;
    Object.freeze(this.#_.post.detail)
    reboot.use(this.#_.post);
    sheet.use(this.#_.post);


  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
    /* Default to null, since undefined state is ignored */
    this.page.$.view = paths.at(0) || null;
  }

  update(meta, query, ...paths) {
    /* Default to null, since undefined state is ignored */
    this.page.$.view = paths.at(0) || null;
  }

  exit(meta) {
    this.page.remove();
  }
})();

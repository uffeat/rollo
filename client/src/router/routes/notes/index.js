import "@/use";
import { items, paths } from "./items";
import { Card } from "./card";
import { Post } from "./post";

const { Exception, component, pop, toTop, router, NavLink } = await use("@/rollo/");
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

    /* Render cards (non-blocking).
    NOTE Since 'cards' is image-rich, the component is rendered once and 
    related data removed from 'items'. */
    const stack = [...paths];
    const next = () => {
      if (!stack.length) return;
      const path = stack.shift();
      items
        .use(path)
        .then((data) => {
          const [abstract, image, title] = pop(
            data,
            "abstract",
            "image",
            "title"
          );
          /* No more changes to data -> freeze */
          Object.freeze(data);
          const card = Card({ path, abstract, image, title });
          this.#_.cards.append(card);
          next(); // Process next item
        })
        .catch((error) => {
          Exception.raise(`Could not load card: ${path}`, () =>
            console.error(error)
          );
        });
    };
    next();

    /* State -> view */
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
          /* Render (non-blocking) and display post.
          NOTE Posts render fast and are typically image-light, so render for 
          each view cycle; avoids cache management and memory/DOM strain. */
          items.use(path).then((data) => {
            const { html } = data;
            const post = Post({ html, path });
            this.#_.post.detail.root.append(post);
            /* NOTE Cannot use 'post' in 'toTop', since 'post' resides in shadow;
            use light-DOM host. */
            toTop(this.#_.post);
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

  /* Part of the router contract (exposed pages get an path attr) */
  get page() {
    return this.#_.page;
  }

  /* Route LC. Runs only once! */
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
    to create a light-DOM sheet (scoped to [page="/notes"] ), which eliminates 
    FOUC. However, the sheet is small, so keep co-located and truly lazily loaded. 
    Importing/constructing sheets does carry a small cost, so done in 'setup'. */
    const { css } = await use("@/rollo/");
    const reboot = await use("@/bootstrap/reboot.css");
    const sheet = css`
      :is(h1, h2, h3, h4, h5, h6) {
        color: var(--bs-link-color);
      }

      img {
        max-width: 100%;
        min-width: 80%;
        border-radius: 0.5rem;
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
    Object.freeze(this.#_.post.detail);
    reboot.use(this.#_.post);
    sheet.use(this.#_.post);
  }

  /* Route LC. Runs every time route becomes active. */
  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
    /* Default to null, since undefined state is ignored */
    this.page.$.view = paths.at(0) || null;
  }

  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(meta, query, ...paths) {
    /* Default to null, since undefined state is ignored */
    this.page.$.view = paths.at(0) || null;
  }

  /* Route LC. Runs just before next route becomes active. */
  exit(meta) {
    this.page.remove();
  }
})();

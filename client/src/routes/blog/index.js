import "@/use";
import Card from "./tools/card";
import { Post, posts } from "./tools/post";

import "@/routes/blog/blog.css";

const { component, toTop, router } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  constructor() {}

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container p-3",
        component.h1({ text: "Blog", slot: "title" })
      );
    }
    return this.#_.page;
  }

  async setup(base) {
    /* Get shadow sheets */
    const reboot = await use("@/bootstrap/reboot.css");
    const shadowSheet = await use(`@/blog/shadow.css`, { auto: true });
    /* Set up shadow */
    this.page.attachShadow({ mode: "open" });
    await (async () => {
      const shadow = component.div(
        { id: "root" },
        component.slot({ name: "title" }),
        component.div({ "[cards]": true }, component.slot()),
        component.slot({ name: "post" })
      );
      this.page.detail.shadow = shadow;
      this.page.shadowRoot.append(shadow);
      reboot.use(this.page);
      shadowSheet.use(this.page);
    })();

    /* Render */
    const bundle = await use(`@/content/bundle/blog.json`);
    const paths = bundle.manifest.map(([path, timestamp]) => path);

    for (let path of paths) {
      const item = bundle.bundle[path];
      /* Convert: /blog/foo -> /foo */
      path = `/${path.split("/").at(-1)}`;
      const card = Card({ path, ...item.meta });
      this.page.append(card);
      const post = Post({ html: item.content, path });
      posts.set(path, post);
    }
    /* Card click -> post view (via router) */
    const LINK = "a.nav-link";
    this.page.on.click = async (event) => {
      if (event.target.matches(LINK) || event.target.closest(LINK)) {
        const card = event.target.closest(`[card]`);
        /* Need this guard, since click may come from post */
        if (card) {
          const path = card.attribute.card;
          await router(`${base}${path}`);
        }
      }
    };

    this.page.$.effects.add(
      (change, message) => {
        const previous = message.owner.previous.post;
        /* Remove any previous post */
        if (previous) {
          const post = posts.get(`/${previous}`);
          post?.remove();
        }
        const current = change.post;
        if (current) {
          /* Post view -> undisplay cards */
          this.page.attribute.postView = true;
          const key = `/${current}`;
          if (!posts.has(key)) {
            router.error(`Invalid path: ${key}.`);
          }
          const post = posts.get(key);
          this.page.append(post);
          toTop(post);
        } else {
          /* Cards view -> display cards */
          this.page.attribute.postView = false;
        }
      },
      { run: false },
      ["post"]
    );
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
    /* Default to null, since undefined state is ignored */
    this.page.$.post = paths.at(0) || null;
  }

  update(meta, query, ...paths) {
    /* Default to null, since undefined state is ignored */
    this.page.$.post = paths.at(0) || null;
  }

  exit(meta) {
    this.page.remove();
  }
})();

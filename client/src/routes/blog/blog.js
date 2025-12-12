import "@/use";
import { component } from "component";
import { layout } from "@/layout/layout";
import { ref } from "@/state/state";
import { router } from "@/router/router";
import { toTop } from "@/tools/scroll";

import Card from "./_tools/card";
import { Post, posts } from "./_tools/post";

import "@/routes/blog/_blog.css";

export default new (class {
  #_ = {};

  constructor() {
    this.#_.state = ref();

    this.state.effects.add(
      (current, message) => {
        const previous = message.owner.previous;
        /* 'current' holds the name of any requested post.
        'previous' holds the name of any previous post (at this moment shown) */

        //console.log("current:", current); ////
        //console.log("previous:", previous); ////

        /* Remove any previous post */
        if (previous) {
          const post = posts.get(`/${previous}`);
          post?.remove();
        }
        if (current) {
          //console.log("Post view"); ////
          /* Undisplay cards */
          this.page.attribute.postView = true;
          const key = `/${current}`;
          if (!posts.has(key)) {
            router.error(`Invalid path: ${key}.`);
          }
          const post = posts.get(key);
          this.page.append(post);
          toTop(post);
        } else {
          //console.log("Cards view"); ////
          /* Display cards */
          this.page.attribute.postView = false;
        }
      },
      { run: false }
    );
  }

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Blog", slot: "title" })
      );
    }
    return this.#_.page;
  }

  get state() {
    return this.#_.state;
  }

  async setup(base) {
    /* Get shadow sheets */
    const reboot = await use("@/bootstrap/reboot.css");
    const shadowSheet = await use(`@/blog/shadow.css`, { auto: true });

    this.page.attribute.page = base;

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
  }

  async enter(meta, url, ...paths) {
    layout.clear(":not([slot])");
    layout.append(this.page);
    /* Default to null, since undefined state is ignored */
    this.state(paths.at(0) || null);
  }

  update(meta, query, ...paths) {
    /* Default to null, since undefined state is ignored */
    this.state(paths.at(0) || null);
  }

  async exit(meta) {
    this.page.remove();
  }
})();



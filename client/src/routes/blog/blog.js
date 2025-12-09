import "@/use.js";
import { component } from "component";
import { ref } from "@/state/state.js";
import { router } from "@/router/router.js";
import { toTop } from "@/tools/scroll.js";

import Card from "./tools/card.js";
import { Post, posts } from "./tools/post.js";

import "/src/routes/blog/blog.css";




/** Prepare components and component factories */

const page = component.main(
  "container mt-3 mb-3",
  component.h1("py-3", { text: "Blog", slot: "title" })
);

/* State for controlling view */
const state = ref();
state.effects.add(
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
      page.attribute.postView = true;
      const key = `/${current}`;
      if (!posts.has(key)) {
        router.error(`Invalid path: ${key}.`);
      }
      const post = posts.get(key);
      page.append(post);
      toTop(post);
    } else {
      //console.log("Cards view"); ////
      /* Display cards */
      page.attribute.postView = false;
    }
  },
  { run: false }
);

async function setup(base) {
  const reboot = await use("@/bootstrap/reboot.css");
  //let shadow

  page.attribute.page = base;
  /* Set up shadow */
  page.attachShadow({ mode: "open" });
  await (async () => {
    const shadow = component.div(
      { id: "root" },
      component.slot({ name: "title" }),
      component.div({ "[cards]": true }, component.slot()),
      component.slot({ name: "post" })
    );
    page.detail.shadow = shadow;
    page.shadowRoot.append(shadow);
    reboot.use(page);
    const shadowSheet = use.meta.DEV ? await use(`/assets/blog/shadow.css`, { as: "sheet" }) : await use(`@/blog/shadow.css`);
    shadowSheet.use(page);




   
  })();

  /* Render */
  const bundle = await use(`@/content/bundle/blog.json`);

  for (let path of bundle.manifest.map(([path, timestamp]) => path)) {
    const item = bundle.bundle[path];
    /* Convert: /blog/foo -> /foo */
    path = `/${path.split("/").at(-1)}`;
    const card = Card({ path, ...item.meta });
    page.append(card);
    const post = Post({ html: item.content, path });
    posts.set(path, post);
  }
  /* Card click -> post view (via router) */
  const LINK = "a.nav-link";
  page.on.click = async (event) => {
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

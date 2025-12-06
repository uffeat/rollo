import "../use.js";
import "../assets/blog.css";

//
//
import shadowCss from "../assets/shadow.css?raw";
//
//
//import "./assets.js";

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, NavLink } = await use("@/router/");
const { toTop } = await use("@/tools/scroll");
const reboot = await use("@/bootstrap/reboot.css");
const { Sheet } = await use("@/sheet");

//
//
let shadowSheet;
if (import.meta.env.DEV) {
  const css = await import("../assets/shadow.css?raw");
  const { Sheet } = await use("@/sheet");
  shadowSheet = Sheet.create(css);
} else {
  shadowSheet = await use(`@/blog/shadow.css`);
}

console.log("shadowSheet:", shadowSheet);////
//
//

/** Prepare components and component factories */

const page = component.main(
  "container mt-3 mb-3",
  component.h1("py-3", { text: "Blog", slot: "title" })
);

page.attachShadow({ mode: "open" });
  const shadow = component.div(
    { id: "root" },
    component.slot({ name: "title" }),
    component.div({ "[cards]": true }, component.slot()),
    component.slot({ name: "post" })
  );
  page.shadowRoot.append(shadow);
  reboot.use(page);

  //
  //
  //shadowSheet.use(page);
  Sheet.create(shadowCss).use(page);
  //
  //



/* */
const Card = ({ html, path }) => {
  /* XXX Build tools produce the full card html (keep it that way for clarity 
  and consistency). This could be injected directly into page. However, we want
  a top-level component handle. So to avoid over-nesting (and styling issues), 
  we create a fresh component, and transfer first child's classes and html. */
  const first = component.div({ innerHTML: html }).firstChild;
  const card = component.div(first.className, { innerHTML: first.innerHTML });
  card.attribute.card = path;
  replaceImages(card);
  return card;
};

const posts = new Map();

/* Returns post component rendered from html and with any internal links 
  replaced with .nav-wrapped NavLinks. */
const Post = ({ html, path }) => {
  const post = component.div({ innerHTML: html, slot: "post" });
  post.attribute.post = path;
  replaceImages(post);
  for (const link of post.querySelectorAll(`a[href]`)) {
    const path = link.getAttribute("href");
    if (path.startsWith("/")) {
      link.parentElement.classList.add("nav");
      link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
    }
  }
  return post;
};

/* */
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
  

  page.attribute.page = base;

  const bundle = await use(`@/content/bundle/blog.json`);
  const manifest = bundle.manifest;
  const paths = manifest.map(([path, timestamp]) => path);
  for (let path of paths) {
    const item = bundle.bundle[path];
    /* Convert: /blog/foo -> /foo */
    path = `/${path.split("/").at(-1)}`;
    const card = Card({ html: item.meta.html, path });
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

/* */
function replaceImages(container) {
  for (const image of container.querySelectorAll(`img`)) {
    const src = image.getAttribute("src");
    if (src.startsWith("/")) {
      const alt = image.getAttribute("alt");
      const replacement = component.img({ alt, src: `${use.meta.base}${src}` });
      image.replaceWith(replacement);
    }
  }
}

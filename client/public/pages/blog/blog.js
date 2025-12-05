const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");
const reboot = await use("@/bootstrap/reboot.css");
const shadowSheet = await use("/pages/blog/shadow.css", { as: "sheet" });

/** Prepare components and component factories */

const page = component.main(
  "container mt-3 mb-3",
  component.h1("py-3", { text: "Blog", slot: "title" })
);
page.attribute.page = true;

page.attachShadow({ mode: "open" });
const shadow = component.div(
  { id: "root" },
  component.slot({ name: "title" }),
  component.div({ "[cards]": true }, component.slot()),
  component.slot({ name: "post" })
);
page.shadowRoot.append(shadow);
reboot.use(page);
shadowSheet.use(page);

const Card = ({ html, path }) => {
  /* XXX Build tools produces the full card html (keep it that way for clarity 
  and consistency). This could be injected directly into page. However, we want
  a top-level component handle. So to avoid over-nesting (and styling issues), 
  we create a fresh component, and transfers first child's classes and html. */
  const first = component.div({ innerHTML: html }).firstChild;
  const card = component.div(first.className, { innerHTML: first.innerHTML });
  card.attribute.card = path;
  return card;
};

const posts = {};

/* Returns post component rendered from html and with any internal links 
  replaced with .nav-wrapped NavLinks. */
const Post = ({ html, path }) => {
  const post = component.div({ innerHTML: html, slot: "post" });
  post.attribute.post = path;
  for (const link of post.querySelectorAll(`a[href]`)) {
    const path = link.getAttribute("href");
    if (path.startsWith("/")) {
      link.parentElement.classList.add("nav");
      link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
    }
  }

  return post;
};

const state = ref();
state.effects.add(
  (current, message) => {
    console.log("current:", current); ////

    if (current) {
      console.log("Post view"); ////
      page.attribute.hide = true;
      const post = posts[`/${current}`];
      page.append(post);
    } else {
      console.log("Cards view"); ////
      //const post = page.find(`[post="/${current}"]`);
      const post = posts[`/${current}`];

      console.log("posts:", posts); ////

      console.log("post:", post); ////
      post?.remove();
      page.attribute.hide = false;
    }
  },
  { run: false }
);

async function setup(base) {
  //console.log('base:', base)////

  const link = await use(`/pages//blog.css`);

  page.attribute.basePath = base;

  const bundle = await use(`/content/bundle/blog.json`);

  const manifest = bundle.manifest;
  const paths = manifest.map(([path, timestamp]) => path);

  for (let path of paths) {
    const item = bundle.bundle[path];
    /* Convert: /blog/foo -> /foo */
    path = `/${path.split("/").at(-1)}`;
    //console.log('path:', path)////
    const card = Card({ html: item.meta.html, path });
    page.append(card);
    const post = Post({ html: item.content, path });
    posts[path] = post;
  }

  /* Card click -> post view (via router) */
  const LINK = "a.nav-link";
  page.on.click = async (event) => {
    if (event.target.matches(LINK) || event.target.closest(LINK)) {
      const card = event.target.closest(`[card]`);
      const path = card.attribute.card;
      await router(`${base}${path}`);
      //
      //
      //console.log('path:', path)////
      //const post = posts[path]
      //console.log('post:', post)////
      //page.attribute.hide = true
      //page.append(post)
    }
  };
}

function enter(meta, query, ...paths) {
  layout.clear(":not([slot])");
  layout.append(page);

  //console.log('paths:', paths)////
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function update(meta, query, ...paths) {
  //console.log('paths:', paths)////
  /* Default to null, since undefined state is ignored */
  state(paths.at(0) || null);
}

function exit(meta) {
  page.remove();
}

export { setup, enter, update, exit };

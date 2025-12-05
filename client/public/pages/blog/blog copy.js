const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { ref } = await use("@/state");
const { router, Nav, NavLink } = await use("@/router/");
const reboot = await use("@/bootstrap/reboot.css");
const shadowSheet = await use("/pages/blog/shadow.css", { as: "sheet" });

console.log("shadowSheet:", shadowSheet); ////

/** Prepare components and component factories */

const page = component.main(
  "container mt-3 mb-3",
  component.h1({ text: "Blog", slot: 'title' }),
);
page.attribute.page = true;

page.attachShadow({ mode: "open" });
const shadow = component.div(
  component.slot({ name: "title" }),
  component.div({ "[cards]": true }, component.slot()),
  component.slot({ name: "post" })
);
page.shadowRoot.append(shadow);
reboot.use(page);
shadowSheet.use(page);

const Card = ({ html }) => {
  const card = component.div("", { innerHTML: html });
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

async function setup(base) {
  const link = await use(`/pages//blog.css`);

  page.attribute.basePath = base;

  const bundle = await use(`/content/bundle/blog.json`);
  //console.log('bundle:', bundle)////
  const manifest = bundle.manifest;
  //console.log('manifest:', manifest)////
  const paths = manifest.map(([path, timestamp]) => path);
  //console.log('paths:', paths)////

  for (const path of paths) {
    const item = bundle.bundle[path];

    //console.log("item:", item); ////

    const card = Card({ html: item.meta.html });
    page.append(card);

    const post = Post({ html: item.content, path });
    posts[path] = post;
  }

  //
  for (const post of Object.values(posts)) {
    page.append(post);
  }
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

/* 
/content/background.test.js
*/
import { pop } from "@/tools/object";

const { Exception, component, defineMethod, toTop, router, NavLink } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");

/* Here we do incur an upfront "import cost", but it's low.
NOTE Could "then-wrap", but it would complicate things, so keep as-is for now. */
const manifest = await use("@/content/blog/_manifest.json");
const paths = manifest.map(([path, timestamp]) => path);
/* Create items store for holding data and friends */
const items = new Map();
/* For path-shortening */
const START = "/blog".length;
for (const path of paths) {
  /* Create 'item' object primed with PwR to enable handling of eager 
    retrieval. Since 'item' is mutable, it can later be changed without tinkering 
    with ordered 'items'. */
  const item = Promise.withResolvers();
  /* Store item with path key stripped of '/blog' prefix  */
  items.set(path.slice(START), item);
}
/* Start "background" building */
for (const [path, item] of items.entries()) {
  const [resolve, reject] = pop(item, "resolve", "reject");
  use(`@/content/blog${path}.json`)
    .then((data) => {
      /* Repackage data and store in item */
      const { html, meta } = data;
      const { abstract, image, title } = meta;
      item.data = { abstract, html, image, title };
      /* Resolve to item.data in service of eager retrieval */
      resolve(item.data);
      /* Promise no longer needed */
      delete item.promise;
    })
    /* Since we build items from manifest, error-handling is probably redundant?
    ... but cheap to keep. */
    .catch((error) => {
      reject(error);
    });
}
/* Patch a 'use' method onto 'item' that gets data from path.
NOTE It would be more elegant to create a custom Items class or to create a 
proxy based on 'items' and 'use'... but probably overkill as long as 
this is just a local pattern. */
defineMethod(items, "use", async (path) => {
  Exception.if(!items.has(path), `Invalid path: ${path}.`);
  const item = items.get(path);
  await item?.promise;
  return item.data;
});

/* Test */
export default async () => {
  frame.clear();

  const cards = component.div(
    "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5"
  );
  const page = component.main("container p-3", { parent: frame }, cards);
  page.on.click((event) => {
    event.preventDefault();
    const target = event.target;
    const link = target.tagName === "A" ? target : target.closest("a");
    if (link) {
      const card = target.closest(".card");
      if (card) {
        const path = card.attribute.path;
        items.use(path).then((data) => {
          const { html } = data;
          const post = Post({ html, path });
          console.log("post:", post); ////
        });
      }
    }
  });

  /* Render cards.
    NOTE Since 'cards' is image-rich, the component is rendered once and 
    related data removed from 'items'. */
  for (const path of items.keys()) {
    items.use(path).then((data) => {
      const [abstract, image, title] = pop(data, "abstract", "image", "title");
      const card = Card({ path, abstract, image, title });
      cards.append(card);
    });
  }
};

function Card({ path, abstract, image, title }) {
  const card = component.div(
    "card",
    {},
    component.img("card-img-top", function () {
      this.src = image.startsWith("/") ? `${use.meta.base}${image}` : image;
      this.alt = `Illustration of ${title.toLowerCase()}`;
    }),
    component.div(
      "card-body.nav.d-flex.flex-column",
      {},
      component.a(
        "nav-link cursor-pointer hover:underline! hover:underline-offset-6! hover:decoration-2!",
        component.h1("card-title", { text: title, title })
      ),
      component.p("card-text", { text: abstract })
    ),
    component.div("card-footer min-h-8")
  );
  card.attribute.path = path;
  return card;
}

function Post({ html, path }) {
  const item = items.get(path);
  console.log("item:", item); ////

  //console.log("html:", html); ////
  const post = component.from(html, { convert: false });

  post.attribute.path = path;
  //replaceImages(post);
  for (const link of post.querySelectorAll(`a[href]`)) {
    const path = link.getAttribute("href");
    if (path.startsWith("/")) {
      link.parentElement.classList.add("nav");
      link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
    }
  }
  return post;
}

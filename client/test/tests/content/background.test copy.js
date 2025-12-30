/* 
/content/background.test.js
*/
import { pop } from "@/tools/object";

const { Exception, component, defineMethod } = await use("@/rollo/");
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
      item.data = Object.freeze({ abstract, html, image, title });
      /* Resolve to item.data in service of eager retrieval */
      resolve(item.data);
      /* Promise no longer needed */
      delete item.promise;
      /* Item is now complete, so freeze */
      Object.freeze(item);
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
defineMethod(items, 'use', async (path) => {
  Exception.if(!items.has(path), `Invalid path: ${path}.`);
  const item = items.get(path);
  await item?.promise;
  return item.data;
})

/* Test */
export default async () => {
  frame.clear();

  
  await (async () => {
    const data = await items.use("/mustang");
    console.log("data:", data);
  })();

  await (async () => {
    const data = await items.use("/mustang");
    console.log("data:", data);
  })();

  await (async () => {
    const cards = component.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5"
    );
    const page = component.main("container p-3", { parent: frame }, cards);
    for (const path of items.keys()) {
      const data = await items.use(path);
      
      const card = Card(data);
      cards.append(card);
    }
  })();
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
  card.attribute.card = path;

  return card;
}

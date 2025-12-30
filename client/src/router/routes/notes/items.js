import { pop } from "@/tools/object";
const { Exception, defineMethod } = await use("@/rollo/");

/* Extend Map to provide 'use' method */
class Items extends Map {
  constructor() {
    super();
  }

  async use(key) {
    Exception.if(!this.has(key), `Invalid key: ${key}.`);
    const item = this.get(key);
    await item?.promise;
    return item.data;
  }
}

/* Here we do incur an upfront "import cost", but it's low.
NOTE Could "then-wrap", but that would complicate things, so keep as-is for now. */
const manifest = await use("@/content/blog/_manifest.json");
const paths = manifest.map(([path, timestamp]) => path);
/* Create items store for holding data and friends */
const items = new Items();
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
  /* NOTE Custom build tools transpiles individual (Frontmatter-style) 
  MD-files to JSON */
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
      /* Shallow-freeze item */
      Object.freeze(item);
    })
    /* Since we build items from manifest, error-handling is probably redundant?
    ... but cheap to keep. */
    .catch((error) => {
      reject(error);
    });
}


export { items };

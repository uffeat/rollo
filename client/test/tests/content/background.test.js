/* 
/content/background.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear();

  const manifest = await use("@/content/blog/_manifest.json");
  const paths = manifest.map(([path, timestamp]) => path);
  /* Prime items */
  const items = new Map();
  for (const path of paths) {
    //console.log("path:", path); ////
    const { promise, resolve } = Promise.withResolvers();
    const item = { promise, resolve };
    items.set(path.slice(5), item);
  }
  /* Start background building */
  for (const [path, item] of items.entries()) {
    use(`@/content/blog${path}.json`).then((data) => {
      //console.log("data:", data); ////
      const { html, meta } = data;
      const { abstract, image, title } = meta;
      const result = { abstract, html, image, title };
      //console.log("item:", item); ////
      const {resolve} = item
      delete item.resolve
      resolve(result);
    });
  }
  /* Create dynamic retriever */
  const retrieve = async (path) => {
    const item = items.get(path);
    console.log("item:", item); ////
    if (item.promise) {
      const result = await item.promise
      delete item.promise
      item.result = result
      return result
      
    }
  };

  /* Test */
  const result = await retrieve('/mustang')
};

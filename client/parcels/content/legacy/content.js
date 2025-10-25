import "../use.js";

const { component } = await use("/component.js");
const content = async (path) => {
  const { promise, resolve } = Promise.withResolvers();
  const link = component.link({
    rel: "stylesheet",
    href: `${use.meta.origin}/_/theme/content${path}.css`,
  });
  link.attribute.path = path;
  link.on.load$once = (event) => {
    const custom = link.__.content;
    if (!custom) {
      throw new Error(`Invalid path:, ${path}`);
    }
    const result = atob(custom.slice(1, -1));
    link.remove();
    resolve(result);
  };
  document.head.append(link);
  const result = await promise;
  return result;
};

use.assets.types.add("content", ({ owner, path }) => {
  return content(path.path.slice(0, -".content".length));
});

export { content };

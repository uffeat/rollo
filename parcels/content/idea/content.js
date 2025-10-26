/* TODO
- timeout
*/

import "../use.js";

let content;

if (window === window.parent) {
  const { component } = await use("/component.js");
  content = async (path) => {
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
      const result = JSON.parse(atob(custom.slice(1, -1)));


        /* TODO
  const bin = atob(value.slice(1, -1));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const result = new TextDecoder("utf-8").decode(bytes);
  */




      link.remove();
      resolve(result);
    };
    document.head.append(link);
    const result = await promise;
    return result;
  };
} else {
  content = async (path) => {
    const { promise, resolve } = Promise.withResolvers();
    window.parent.dispatchEvent(
      new CustomEvent("_use", {
        detail: {
          name: "content",
          path,
          /* TODO
          - Use resolve as callback directly */
          callback: (result) => {
            resolve(result);
          },
        },
      })
    );
    const result = await promise;
    return result;
  };
}

use.assets.types.add("content", ({ owner, path }) => {
  return content(path.path.slice(0, -".content".length));
});

export { content };

/*
basics.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async ({ marked }) => {
  layout.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: layout });

  const Post = async (path) => {
    const result = component.div({ innerHTML: marked.parse(await use(path)) });
    for (const image of result.querySelectorAll("img")) {
      image.replaceWith(
        component.img({
          src: `${use.meta.base}${image.getAttribute("src")}`,
          alt: image.alt,
        })
      );
    }
    return result;
  };

  Post("/content/blog/bevel.md").then((post) => page.append(post));
};

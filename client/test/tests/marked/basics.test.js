/*
/marked/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { marked } = await use("@/marked");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });

  const Post = async (path) => {
    const text = await use(path);
    const parts = text.trim().split("---");
    const md = parts.slice(2).join("");

    const result = component.div({ innerHTML: marked.parse(md) });
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

  Post("/content/src/blog/bevel.md").then((post) => page.append(post));
};

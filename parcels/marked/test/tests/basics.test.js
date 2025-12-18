/*
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { marked } = await use("@/marked");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });

  const Post = async (path) => {
    /* NOTE Import engine handles md, so this is just to demo */
    const text = await use(path, { raw: true });
    const [yaml, md] = text.split("---").slice(1);
    const result = component.div({ innerHTML: marked.parse(md) });

    /*
    for (const image of result.querySelectorAll("img")) {
      image.replaceWith(
        component.img({
          src: `${use.meta.base}${image.getAttribute("src")}`,
          alt: image.alt,
        })
      );
    }
      */
    return result;
  };

  Post("/content/blog/sprocket.md").then((post) => page.append(post));
};

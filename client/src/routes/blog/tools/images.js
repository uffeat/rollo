import "@/use";

const { component } = await use("@/rollo/");

export const replaceImages = (container) => {
    for (const image of container.querySelectorAll(`img`)) {
      const src = image.getAttribute("src");
      if (src.startsWith("/")) {
        image.replaceWith(component.img({
          alt: image.getAttribute("alt"),
          src: `${use.meta.base}${src}`,
        }));
      }
    }
  };
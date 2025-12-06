import "../../use.js";

const { component } = await use("@/component");

export const replaceImages = (container) => {
    for (const image of container.querySelectorAll(`img`)) {
      const src = image.getAttribute("src");
      if (src.startsWith("/")) {
        const alt = image.getAttribute("alt");
        const replacement = component.img({
          alt,
          src: `${use.meta.base}${src}`,
        });
        image.replaceWith(replacement);
      }
    }
  };
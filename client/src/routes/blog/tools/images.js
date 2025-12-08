import "@/use.js";
import { component } from "component";

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
import "../../use.js";

const { component } = await use("@/component");
const { NavLink } = await use("@/router/");

const replaceImages = (container) => {
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

export const posts = new Map();

/* Returns post component rendered from html and with any internal links 
  replaced with .nav-wrapped NavLinks. */
export const Post = ({ html, path }) => {
    const post = component.div({ innerHTML: html, slot: "post" });
    post.attribute.post = path;
    replaceImages(post);
    for (const link of post.querySelectorAll(`a[href]`)) {
      const path = link.getAttribute("href");
      if (path.startsWith("/")) {
        link.parentElement.classList.add("nav");
        link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
      }
    }
    return post;
  };

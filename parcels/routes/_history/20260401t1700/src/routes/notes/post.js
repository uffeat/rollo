import "../../../use";

const { component } = await use("@/rollo/");
const { NavLink } = await use("@/router/");

export const Post = ({ html, path }) => {
  const post = component.from(html, { convert: false });

  for (const image of post.querySelectorAll(`img`)) {
    const src = image.getAttribute("src");
    if (src.startsWith("/")) {
      image.replaceWith(component.img({ src: `${use.meta.base}${src}` }));
    }
  }

  for (const link of post.querySelectorAll(`a[href]`)) {
    const path = link.getAttribute("href");
    if (path.startsWith("/")) {
      link.parentElement.classList.add("nav");
      link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
    }
  }
  return post;
};

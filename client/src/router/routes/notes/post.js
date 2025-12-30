const { NavLink, component } = await use("@/rollo/");

export const Post = ({ html, path }) => {
  const post = component.from(html, { convert: false });
  for (const link of post.querySelectorAll(`a[href]`)) {
    const path = link.getAttribute("href");
    if (path.startsWith("/")) {
      link.parentElement.classList.add("nav");
      link.replaceWith(NavLink("nav-link", { path, text: link.textContent }));
    }
  }
  return post;
};

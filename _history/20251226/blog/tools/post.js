import "@/use";
import { replaceImages } from "./images";

const { component, NavLink } = await use("@/rollo/");

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

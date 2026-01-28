import "../use";
import "./home";
import error from "./error";
import { nav } from "./tools/nav";

const { capitalize } = await use("@/rollo/");
const { NavLink, router, Route } = await use("@/router/");

/* Define module-based routes and navs */
for (let [path, route] of Object.entries(
  import.meta.glob("./routes/**/index.js", { eager: true, import: "default" }),
)) {
  //console.log("route:", route); ////
  path = `/${path.split("/").at(-2)}`;
  const text = capitalize(path.slice(1));
  NavLink("nav-link", {
    text,
    path,
    title: text,
    parent: nav,
  });
  router.routes.add(path, route);
}

const setup = async () => {
  /* Complete router setup */
  await router.setup({
    error,
  });
};

export { nav, setup };

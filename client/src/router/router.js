import '../use.js'
import error from "./error.js";
let ran;

export default async () => {
  if (ran) {
    return;
  }
  ran = true;

  const { layout } = await use("@/layout/");
  const { component } = await use("@/component");
  const { router, Nav, NavLink } = await use("@/router/");

  /* Define routes */
  router.routes.add({
    "/": await use("/pages/home.x.html"),
    "/about": await use("/pages/about.x.html"),
    "/blog": await use("/pages/blog.x.html"),
    "/blogrun": await use("/pages/blogrun.x.html"),
    "/terms": await use("/pages/terms/"),
  });

  /* Create nav */
  Nav(
    component.nav(
      "nav router flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink("nav-link", {
        text: "About",
        path: "/about",
        title: "About",
      }),
      NavLink("nav-link", { text: "Blog", path: "/blog", title: "Blog" }),
      NavLink("nav-link", {
        text: "Blog (runtime)",
        path: "/blogrun",
        title: "Blog",
      }),
      NavLink("nav-link", { text: "Terms", path: "/terms", title: "Terms" })
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/favicon.svg");
      }
    )
  );

  await router.setup({ error });

  console.log("Router set up");
};

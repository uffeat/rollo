/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");
if (use.meta.DEV) {
  /* NOTE Rules in "/dev.css" should eventually be transferred to 
  "/client/assets/main.css" from where build tools will minify etc. */
  await use("/dev.css");
}

const { layout } = await use("@/layout/");
const { component } = await use("@/component");
const { router, Nav, NavLink } = await use("@/router/");

/* Define routes */
router.routes.add({
  "/": (await use("/pages/home.x.html"))(),
  "/about": (await use("/pages/about.x.html"))(),
  "/blog": (await use("/pages/blog.x.html"))(),
});

/* Create nav */
Nav(
  component.nav(
    "nav flex flex-col gap-y-1 p-1",
    { slot: "side", parent: layout },
    NavLink("nav-link",{ text: "About", path: "/about", title: "About" }),
    NavLink("nav-link",{ text: "Blog", path: "/blog", title: "Blog" }),

    NavLink("nav-link",{ text: "Bad, bad...", path: "/bad/bad" }),
  ),
  /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/favicon.svg");
      }
    )
);


await router.setup();

console.log('Router set up')

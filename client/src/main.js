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
const { router, NavLink } = await use("@/router/");

/* Define routes */
router.routes.add({
  "/": (await use("/pages/home.x.html"))(),
  "/about": (await use("/pages/about.x.html"))(),
});


component.a(
  { parent: layout,slot: "home", title: 'Home',  cursor: "pointer" },

  async function () {
    this.innerHTML = await use("/vite.svg")
  

    this.on.click = async (event) => {
      await router("/");
    };
  }
);

/* Create nav */
component.nav(
  "nav.d-flex.flex-column",
  { slot: "side", parent: layout },
  NavLink({ text: "About", path: "/about" })
);

await router.setup();


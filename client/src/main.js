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
const { component } = await use("@/component.js");
const { router, NavLink } = await use("@/router/");

/* Define routes */
router.routes.add({
  "/": (await use("/pages/home.x.html"))(),
  "/about": (await use("/pages/about.x.html"))(),
});

//NavLink({ text: "Home", path: "/", slot: 'home', parent: layout })

component.a(
  { slot: "home", parent: layout, cursor: "pointer" },

  async function () {
    component.span({ parent: this, innerHTML: await use("/vite.svg") });

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

//component.button("rounded bg-sky-500 foo", { parent: layout, text: "Tester" });
//component.button("btn.btn-primary", { parent: layout, text: "Tester" });

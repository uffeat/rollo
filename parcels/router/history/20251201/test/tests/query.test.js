/*
/query.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Nav, NavLink, router } = await use("@/router/");

export default async () => {
  layout.clear();

  /* Create nav */
  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink("nav-link", { text: "Hero", path: "/hero", title: "Hero" }),
      NavLink("nav-link", { text: "Clayton", path: "/hero", title: "Clayton", query: {name: "clayton"} }),
      NavLink("nav-link", { text: "Max", path: "/hero", title: "Max", query: {name: "max"} }),
      
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/vite.svg");
      }
    )
  );

  /* Define routes */
  await router.setup({
    routes: {
      "/": (await use("/pages/home.x.html"))(),
      "/hero": (await use("/pages/hero.x.html"))(),
     
    },
  });

  layout.open();
};

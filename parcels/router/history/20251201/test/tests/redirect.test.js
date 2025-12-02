/*
/redirect.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Nav, NavLink, router } = await use("@/router/");

export default async () => {
  layout.clear();

  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink("nav-link", { text: "Home", path: "/home" })
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/vite.svg");
      }
    )
  );

  await router.setup({
    routes: {
      "/": (await use("/pages/home.x.html"))(),
    },
    redirect: {
      "/home": "/",
    },
  });
}

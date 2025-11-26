/*
/basics.test.js
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
      NavLink("nav-link", {
        text: "Boom",
        path: "/boom",
        title: "Boom",
        __fontWeight: 900,
      }),
      NavLink("nav-link", { text: "Pow", path: "/pow", title: "Pow" }),
      NavLink("nav-link", { text: "Bad", path: "/bad" })
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
      "/boom": (await use("/pages/boom.x.html"))(),
      "/pow": (await use("/pages/pow.x.html"))(),
    },
  });

  layout.open();
};

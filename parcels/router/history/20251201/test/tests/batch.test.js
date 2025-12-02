/*
/batch.test.js
*/
import { pages } from "../pages";

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { router, Nav, NavLink } = await use("@/router/");



export default async () => {
  layout.clear();

  /* Define routes */
  router.routes.add(
    Object.fromEntries(
      Object.entries(pages).map(([path, load]) => {
        const route = async (...args) => {
          const mod = await load();
          mod.default(...args);
        };
        return [path, route];
      })
    )
  );

  /* Create nav */
  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      ...[
        ["About", "/about"],
        ["Color", "/color"],
        ["Foo", "/foo"],
      ].map(([text, path]) => NavLink("nav-link", { text, path, title: text }))
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/vite.svg");
      }
    )
  );

  /* Setup */
  await router.setup();
}

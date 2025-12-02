/*
/auto.test.js
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
      NavLink("nav-link", { text: "Boom", path: "/boom" }),
      NavLink("nav-link", { text: "Pow", path: "/pow" })
    )
  );

  await router.setup({
    strict: false,
  });
}

/*
/nav.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { Nav, NavLink, router } = await use("@/router/");


export default async () => {
  layout.clear();

  /* Define routes */
  router.routes.add({
    "/boom": (await use("/pages/boom.x.html"))(),
    "/pow": (await use("/pages/pow.x.html"))(),
  });

  /* Create nav */

  

  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink({ text: "Boom", path: "/boom", __fontWeight: 900 }),
      NavLink({ text: "Pow", path: "/pow" }),
      NavLink({ text: "Bad", path: "/bad" })
    )
  );

  await router.setup();

  layout.open();
};

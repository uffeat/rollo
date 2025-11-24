/*
/router/x.js
*/

/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router.js", parcel);

const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { NavLink, router } = await use("@/router.js");

console.dir(location);

const base = "/test/test.html";

console.log("base:", base);

export default async () => {
  layout.clear();

  /* Define routes */
  router.routes.add({
    [`${base}/foo`]: (await use("/test/pages/foo.x.html"))(),
    [`${base}/bar`]: (await use("/test/pages/bar.x.html"))(),
  });

  /* Create nav */
  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    NavLink({ text: "Foo", path: `${base}/foo` }),
    NavLink({ text: "Bar", path: `${base}/bar` }),
    NavLink({ text: "Bad", path: "/bad" })
  );

  await router.setup({
    strict: false,
  });
};

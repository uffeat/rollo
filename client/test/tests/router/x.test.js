/*
/router/x.test.js
*/

/* Create 'assets' import engine source for testing */
import "./assets.js";
/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router/router.js", parcel);

const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { NavLink, router } = await use("@/router/");

const BASE = "/test/test.html";

export default async () => {
  layout.clear();

  /* Define routes */
  router.routes.add({
    [`${BASE}`]: (await use("assets/home.x.html"))(),
    [`${BASE}/foo`]: (await use("assets/foo.x.html"))(),
    [`${BASE}/bar`]: (await use("assets/bar.x.html"))(),
  });

  /* Create nav */
  component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    NavLink({ text: "Foo", path: `${BASE}/foo` }),
    NavLink({ text: "Bar", path: `${BASE}/bar` }),
    NavLink({ text: "Bad", path: "/bad" })
  );

  await router.setup();
};

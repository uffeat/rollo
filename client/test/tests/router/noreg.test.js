/*
/router/noreg.test.js

About
Demo of 'x'-assets as routes. 
Since 'x'-assets are functions, these can be registered as routes in a lean way.
*/

import "./xpages.js";
/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router/router.js", parcel);

const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { NavLink, router } = await use("@/router/");

export default async () => {
  layout.clear();

  /* Create nav */
  component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    NavLink({ text: "Boom", path: "/boom" }),
    NavLink({ text: "Pow", path: "/pow" })
  );

  await router.setup({ strict: false });
};

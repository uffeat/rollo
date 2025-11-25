/*
/router/basics.test.js

About


*/

import { BASE, pages } from "./pages.js";



/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router/router.js", parcel);

const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { NavLink, router } = await use("@/router");

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
  component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    ...[
      ["Home", BASE],
      ["Foo", `${BASE}/foo`],
      ["Foo with args", `${BASE}/foo/ding/dong`],
      ["Color", `${BASE}/color`],
      ["Color -> green", `${BASE}/color/green`],
    ].map(([text, path]) => NavLink({ text, path }))
  );

  /* Setup */
  await router.setup();
};

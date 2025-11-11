/* Testbench.

Runs on:
http://localhost:3869/test/test.html

NOTE 
- Test scripts can access
  - unbuilt parcels
  - built parcels
  - public assets
  - assets
*/

import "../src/use/use.js";
import { setup } from "../../test/setup.js";

document.querySelector("html").dataset.bsTheme = "dark";



await setup()(
  {
    tests: {
      ...import.meta.glob("./tests/**/*.js"),
      ...import.meta.glob("./tests/**/*.html", {
        query: "?raw",
      }),
    },
    report: async ({ path, result, test }) => {},
  },
  {}
);

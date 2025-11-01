import "../../../client/src/use/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.assets.add("@/sheet.js", parcel);

document.querySelector("html").dataset.bsTheme = "dark";

/* Create object with CSS (text) values for testing */
const assets = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("./tests/**/*.css", {
      eager: true,
      import: "default",
      query: "?raw",
    }),
  }).map(([path, css]) => [path.slice("../tests".length, -".css".length), css])
);

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
  { assets, ...parcel }
);





import "../../../client/src/use/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.assets.add("@/layout/layout.js", parcel);
use.assets.add("@//layout.js", parcel);

document.querySelector("html").dataset.bsTheme = "dark";




await setup({base: 'https://rolloh.vercel.app'})(
  {
    tests: {
      ...import.meta.glob("./tests/**/*.js"),
      ...import.meta.glob("./tests/**/*.html", {
        query: "?raw",
      }),
    },
    report: async ({ path, result, test }) => {},
  },
  { ...parcel }
);


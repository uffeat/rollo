import "../../../client/src/use/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.assets.add("@/app/app.js", parcel);
use.assets.add("@//app.js", parcel);

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
  { ...parcel }
);

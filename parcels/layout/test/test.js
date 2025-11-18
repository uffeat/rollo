import "../../../client/src/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";

/* Overload to use live parcel */
use.add("@/layout/", ({ path }) => {
  path.detail.escape = true;
  return parcel;
});

document.documentElement.dataset.bsTheme = "dark";

await setup()(
  {
    ...import.meta.glob("./tests/**/*.js"),
    ...import.meta.glob("./tests/**/*.html", {
      query: "?raw",
    }),
  },
  { ...parcel }
);

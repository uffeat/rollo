import "../../../client/src/use/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.assets.add("@/spinner/spinner.js", parcel);
use.assets.add("@//spinner.js", parcel);

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
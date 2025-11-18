import "../../../client/src/use.js";
import { setup } from "../../../test/setup.js";
import * as parcel from "../index.js";
/* Overload to use live parcel */
use.add("@/sheet.js", parcel);








document.documentElement.dataset.bsTheme = "dark";

await setup()(
  {
    ...import.meta.glob("./tests/**/*.js"),
    ...import.meta.glob("./tests/**/*.html", {
      query: "?raw",
    }),
  },
  {
    ...parcel,
    /* Create sheets object with CSS (text) values for testing */
    sheets: Object.fromEntries(
      Object.entries({
        ...import.meta.glob("./tests/**/*.css", {
          eager: true,
          import: "default",
          query: "?raw",
        }),
      }).map(([path, css]) => [
        path.slice("../tests".length, -".css".length),
        css,
      ])
    ),
  }
);

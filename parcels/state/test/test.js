import "../../../client/src/use/use.js";
import { setup } from "../../../test/setup.js";

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
  {
    ReactiveComponent: async () =>
      (
        await import("../src/reactive/component.js")
      ).ReactiveComponent,
    RefComponent: async () =>
      (
        await import("../src/ref/component.js")
      ).RefComponent,
  }
);

import "../use.js";
import { setup } from "../../../../../assets/test/setup.js";
import { Sheet, css } from "../index.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("//app.js");
const { Layout } = await use("//layout.js");

const app = App({ parent: document.body });
const layout = Layout({ parent: app });

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

//console.log(assets)

await setup(
  {
    tests: {
      ...import.meta.glob("./tests/**/*.js"),
      ...import.meta.glob("./tests/**/*.html", {
        query: "?raw",
      }),
    },
    report: async ({ path, result, test }) => {},
  },
  { Sheet, app, css, assets, layout }
);

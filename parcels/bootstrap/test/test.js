import "../use.js";
import { setup } from "../../../../../assets/test/setup.js";
import { bootstrap } from "../index.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("/app.js");
const app = App({ parent: document.body });
const { Layout } = await use("//layout.js");
const layout = Layout({ parent: app });



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
  { bootstrap, layout }
);

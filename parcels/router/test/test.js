import "../src/use.js";
import { setup } from "../../../../test/setup.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("/app.js");
const app = App({ parent: document.body });
const { Layout } = await use("//layout.js");
const layout = Layout({ parent: app });

const tests = {
  ...import.meta.glob("./tests/**/*.js"),
  ...import.meta.glob("./tests/**/*.html", {
    query: "?raw",
  }),
};

await setup(
  { tests, report: async ({ path, result, test }) => {} },
  { layout }
);


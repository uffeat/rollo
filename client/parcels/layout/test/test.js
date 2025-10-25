import "../use.js";
import { setup } from "../../../../../assets/test/setup.js";
import { Layout } from "../index.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("//app.js");


const app = App({ parent: document.body });
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
  { layout }
);


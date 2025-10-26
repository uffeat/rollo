import "../use.js";
import { setup } from "../../../../../assets/test/setup.js";
import { Blog } from "../index.js";

document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("//app.js");
const { Layout } = await use("//layout.js");

const app = App({ parent: document.body });
const layout = Layout({ parent: app });

//
//
layout.clear(":not([slot])");
const blog = Blog({ parent: layout });
//
//

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
  {
    layout,
    Blog,
  }
);

import "../use.js";
import { setup } from "../../../../../assets/test/setup.js";
import { Component, component } from "../src/component.js";
import { author } from "../src/tools/author.js";
import { mix } from "../src/tools/mix.js";
import { mixins } from "../src/mixins/mixins.js";



document.querySelector("html").dataset.bsTheme = "dark";

const { App } = await use("//app.js");
const { Layout } = await use("//layout.js");

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
  {
    app,
    layout,
    author,
    Component,
    component,
    mix,
    mixins,
  }
);

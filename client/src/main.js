/* Initialize import engine */
import "@/use";
/* Load main sheet (with Tailwind) */
import "@/assets/main.css";

import { layout } from "@/layout/layout";
//import { component } from "component";
import { Nav, NavLink, router } from "@/router/router";

import * as home from "@/routes/home";
import * as blog from "@/routes/blog/blog";
import * as articles from "@/routes/articles/articles";

(() => {
  const modules = Object.fromEntries(
  Object.entries({
    ...import.meta.glob(["./component/component.js"], { eager: true }),
  }).map(([k, v]) => {
    return [k.split("/").at(-1), v];
  })
);
//console.log("modules:", modules); ////

use.sources.add("@@", ({ path }) => {
  //console.log("path.path:", path.path); ////
  return modules[`${path.path.slice(1)}`];
});

})();



//const {component: comp} = modules['component']
const { component } = await use("@@/component");
//console.log("comp:", comp); ////

/* Define routes */
router.routes.add({
  "/": home,
  "/blog": blog,
  "/articles": articles,
});

/* Create nav */
Nav(
  component.nav(
    "nav router flex flex-col gap-y-1 p-1",
    { slot: "side", parent: layout },
    NavLink("nav-link", {
      text: "About",
      path: "/about",
      title: "About",
    }),
    NavLink("nav-link", { text: "Blog", path: "/blog", title: "Blog" }),
    NavLink("nav-link", {
      text: "Articles",
      path: "/articles",
      title: "Articles",
    }),
    NavLink("nav-link", { text: "Terms", path: "/terms", title: "Terms" })
  ),
  /* Pseudo-argument for code organization */
  NavLink(
    { path: "/", parent: layout, slot: "home", title: "Home" },
    async function () {
      this.innerHTML = await use("/favicon.svg");
    }
  )
);

await router.setup({
  error: (() => {
    const page = component.main(
      "container",
      component.h1({ text: "Page not found" })
    );
    const details = component.p({ parent: page });
    return (message) => {
      if (message) {
        if (message instanceof Error) {
          message = message.message;
        }

        details.text = message;
      } else {
        details.clear();
      }

      layout.clear(":not([slot])");
      layout.append(page);
    };
  })(),
});

if (import.meta.env.DEV) {
  /* Add 'tests' source to import engine */
  await (async () => {
    const START = "../test/tests".length;
    const loaders = Object.fromEntries(
      Object.entries({
        ...import.meta.glob("../test/tests/**/*.test.js"),
      }).map(([k, v]) => {
        return [k.slice(START), v];
      })
    );
    use.sources.add("tests", async ({ path }) => {
      if (!(path.path in loaders)) {
        throw new Error(`Invalid path:${path.full}`);
      }
      return await loaders[path.path]();
    });
  })();

  /* Runs test. */
  const run = async (path) => {
    const asset = await use(`tests${path}`);
    await asset.default();
  };

  /* Add test control */
  await (async () => {
    const KEY = "__test__";

    window.addEventListener(
      "keydown",
      (() => {
        return async (event) => {
          /* Unit tests */
          if (event.code === "KeyU" && event.shiftKey) {
            const path = prompt("Path:", localStorage.getItem(KEY) || "");
            localStorage.setItem(KEY, path);
            await run(path);
          }
        };
      })()
    );
  })();
}

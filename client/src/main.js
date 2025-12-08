/* Initialize import engine */
import "@/use.js";
/* Activate Tailwind */
import "./main.css";
/* Load Bootstrap sheet */
import "./bootstrap/bootstrap.css";

console.log("Global sheets loaded");////

import { layout } from "@/layout/layout.js";

import { component } from "component";
import { Nav, NavLink, router } from "@/router/router.js";

import * as home from "@/routes/home.js";
import * as blog from "@/routes/blog/blog.js";

/* Define routes */
router.routes.add({
  "/": home,
  "/blog": blog,
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

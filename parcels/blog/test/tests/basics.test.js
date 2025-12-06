/*
/basics.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { router, Nav, NavLink } = await use("@/router/");
const { blog } = await use("@/blog/");

export default async () => {
  /* Define routes */
  router.routes.add({
    "/": (() => {
      const page = component.main(
        "container pt-3",
        component.h1({ text: "Home" })
      );
      return (meta, url, ...paths) => {
        if (meta.enter) {
          layout.clear(":not([slot])");
          layout.append(page);
          return;
        }
        if (meta.exit) {
          page.remove();
          return;
        }
      };
    })(),
    "/blog": blog,
  });

  /* Create nav */
  Nav(
    component.nav(
      "nav router flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink("nav-link", { text: "Blog", path: "/blog", title: "Blog" })
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

  console.log("Router set up");
};

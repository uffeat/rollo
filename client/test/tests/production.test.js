/*
/production.test.js
*/

export default async () => {




  const { layout } = await use("@/layout/");
  const { component } = await use("@/component");
  const { router, Nav, NavLink } = await use("@/router/");
  const { blog } = await use("@/blog/");

  /* Define routes */
  router.routes.add({
    //"/": await use("/pages/home.x.html"),
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

    "/about": await use("/pages/about.x.html"),
    "/blog": blog,
   
    //"/terms": await use("/pages/terms/"),
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






}
import error from './error.js'
let ran;

export default async () => {
  if (ran) {
    return;
  }
  ran = true;

  const { layout } = await use("@/layout/");
  const { component } = await use("@/component");
  const { router, Nav, NavLink } = await use("@/router/");


  //
  //
  /* highjack for dev */
  const { Exception } = await use("@/tools/exception");
  const { type } = await use("@/tools/type");

  const types = new Set(["AsyncFunction", "Function", "Module", "Object"]);

  const routes = new (class {
    #_ = {
      registry: new Map(),
    };

    get size() {
      return this.#_.registry.size;
    }

    add(spec) {
      for (const [path, route] of Object.entries(spec)) {
        /* Type check */
        const _type = type(route);
        Exception.if(!types.has(_type), `Invalid route type: ${_type}`);
        Exception.if(
          (_type === "Module" || _type === "Object") &&
            route.default &&
            typeof route.default !== "function",
          `Invalid default member (expected a function; got type: ${_type})`,
          () => console.error(`default:`, route.default)
        );
        /* Register */
        this.#_.registry.set(path, { route });
      }
    }

    async get(path) {
      const detail = this.#_.registry.get(path);
      if (typeof detail.route === "function") {
        return detail.route;
      }
      /* Module or Object route -> use default as route function */
      if (typeof detail.route.default === "function") {



        detail.route = await detail.route.default();
        return detail.route;
      }
    }

    has(path) {
      return this.#_.registry.has(path);
    }

    remove(path) {
      return this.#_.registry.delete(path);
    }
  })();

  router.routes = routes

  //
  //

  /* Define routes */
  router.routes.add({
    "/": await use("/pages/home.x.html"),
    "/about": await use("/pages/about.x.html"),
    "/blog": await use("/pages/blog.x.html"),
    "/blogrun": await use("/pages/blogrun.x.html"),
  });

  /* Create nav */
  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      NavLink("nav-link", {
        text: "About",
        path: "/about",
        title: "About",
      }),
      NavLink("nav-link", { text: "Blog", path: "/blog", title: "Blog" }),
      NavLink("nav-link", {
        text: "Blog (runtime)",
        path: "/blogrun",
        title: "Blog",
      })
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/favicon.svg");
      }
    )
  );

  await router.setup();

  console.log("Router set up");
};

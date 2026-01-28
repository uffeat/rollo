/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Route, router, Nav, NavLink } = await use("@/router/");

export default async () => {
  const nav = Nav(
    component.nav("nav router flex flex-col gap-y-1 p-1", {
      slot: "side",
      parent: frame,
    }),
  );

  /* / route */
  await (async () => {
    /* Prepare route */
    const path = "/";
    const page = component.main(
      "container pt-3",
      component.h1({ text: "Home" }),
    );
    function enter() {
      frame.clear(":not([slot])");
      frame.append(this.page);
    }
    /* Add route */
    const route = Route.create({ enter, page, path });
    router.routes.add(path, route);
    /* Add nav link */
    NavLink("nav-link", {
      path,
      innerHTML: await use("/favicon.svg"),
      slot: "home",
      parent: frame,
    });
  })();

  /* /foo route */
  await (async () => {
    /* Prepare route */
    const path = "/foo";
    const page = component.main(
      "container pt-3",
      component.h1({ text: "Foo" }),
    );
    function enter() {
      frame.clear(":not([slot])");
      frame.append(this.page);
    }
    /* Add route */
    const route = Route.create({ enter, page, path });
    router.routes.add(path, route);
    /* Add nav link */
    NavLink("nav-link", { path, text: "Foo", parent: nav });
  })();

  /* /bar route */
  await (async () => {
    /* Prepare route */
    const path = "/bar";
    const page = component.main(
      "container pt-3",
      component.h1({ text: "Bar" }),
    );
    function enter() {
      frame.clear(":not([slot])");
      frame.append(this.page);
    }
    /* Add route */
    const route = Route.create({ enter, page, path });
    router.routes.add(path, route);
    /* Add nav link */
    NavLink("nav-link", { path, text: "Bar", parent: nav });
  })();

  const error = (message) => {
    const page = component.main(
      "container",
      component.h1({ text: "Page not found" }),
    );
    const details = component.p({ parent: page });

    if (message) {
      if (message instanceof Error) {
        message = message.message;
      }
      details.text = message;
    } else {
      details.clear();
    }
    frame.clear(":not([slot])");
    frame.append(page);
  };

  await router.setup({ error });

  NavLink("nav-link", { path: '/bad', text: "Bad", parent: nav });
};

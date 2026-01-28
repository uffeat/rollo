/* 
/basics.test.js
*/

const { component } = await use("@/rollo/");
const { nav, setup } = await use("@/routes/");
const { router, Route, NavLink } = await use("@/router/");

export default async () => {

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
  

  await setup()
};

/*
/state.test.js
*/

const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { router, Nav, NavLink } = await use("@/router/");

const heading = component.h1();
const page = component.main("container", heading);

const Effect = () => {
  return (current, message, query) => {
    current = current === "/" ? "/home" : current;

    //console.log("current:", current);////
    //console.log("query:", query);////

    layout.clear(":not([slot])");
    heading.text = `${current.at(1).toUpperCase()}${current.slice(2)}`;
    layout.append(page);
  };
};

export default async () => {
  layout.clear();
  router.effects.add(Effect(), { run: false }, ["/"]);
  router.effects.add(Effect(), { run: false }, ["/foo"]);
  router.effects.add(Effect(), { run: false }, ["/bar"]);

  /* Create nav */
  Nav(
    component.nav(
      "nav flex flex-col gap-y-1 p-1",
      { slot: "side", parent: layout },
      ...[
        ["Foo", "/foo"],
        ["Bar", "/bar"],
      ].map(([text, path]) => NavLink("nav-link", { text, path, title: text }))
    ),
    /* Pseudo-argument for code organization */
    NavLink(
      { path: "/", parent: layout, slot: "home", title: "Home" },
      async function () {
        this.innerHTML = await use("/vite.svg");
      }
    )
  );

  /* Setup */
  await router.setup({ strict: false });
};

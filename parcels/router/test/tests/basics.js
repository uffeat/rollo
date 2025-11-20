/* 
/basics.js
*/

const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Sheet, css, rule, scope } = await use("@/sheet.js");

const sheet = Sheet.create({
  ".nav-link": {
    fontSize: css.rem(1.125),
    cursor: "pointer",
  },

  ".nav-link.active": {
    fontWeight: 700,
  },
}).use();

export default async ({ router }) => {
  layout.clear();

  router.routes.add({
    "/foo": async (...args) => {
      const mod = await use("/test/pages/foo.js");
      mod.default(...args);
    },
    "/bar": async (...args) => {
      const mod = await use("/test/pages/bar.js");
      mod.default(...args);
    },
    "/color": async (...args) => {
      const mod = await use("/test/pages/color.js");
      mod.default(...args);
    },
  });

  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },

    component.a("nav-link", { text: "Foo", $path: "/foo" }),
    component.a("nav-link", { text: "Foo with args", $path: "/foo/ding/dong" }),
    component.a("nav-link", { text: "Bar", $path: "/bar/stuff" }),
    component.a("nav-link", { text: "Color", $path: "/color" }),
    component.a("nav-link", { text: "Color -> green", $path: "/color/green" })
  );
  nav.on.click = async (event) => {
    const target = event.target.closest(`[state-path]`);
    if (target) {
      event.preventDefault();
      router.use(target.$.path);
    }
    layout.close();
  };

  await router.use(location.pathname, { silent: true });
};

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

  await router.setup("/color.page");

  await (async () => {
    const { component } = await use("@/component.js");
    const { layout } = await use("@/layout/");
    const page = component.main("container", component.h1({ text: "Foo" }));

    router.add("/foo", ({ current, residual, router }) => {
      layout.clear(":not([slot])");
      layout.append(page);
    });
  })();

  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    component.a("nav-link", { text: "About", $path: "/about" }),
    component.a("nav-link", { text: "Color", $path: "/color" }),
    component.a("nav-link", { text: "Home", $path: "/home" }),
    component.a("nav-link", { text: "Foo", $path: "/foo" }),
    component.a("nav-link", { text: "Bar", $path: "/bar" }),
   
  );

  //nav.on._connected = (event) => sheet.use()
  //nav.on._disconnected = (event) => sheet.unuse()

  nav.on.click = async (event) => {
    const target = event.target.closest(`[state-path]`);
    if (target) {
      event.preventDefault();
      router(target.$.path);
    }
    layout.close();
  };

  router.effects.add((current) => {
    let active = nav.find(`.active`);
    if (active) {
      active.classes.remove("active");
    }
    active = nav.find(`[state-path="${current}"]`);
    if (active) {
      active.classes.add("active");
    }
  });
};

/* 
/basics.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async ({ router }) => {
  layout.clear();

  await router.setup("/color.page");

  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    component.a("nav-link", { text: "About", $path: "/about.page/ding/dong" }),
    component.a("nav-link", { text: "Color", $path: "/color.page" }),
    component.a("nav-link", { text: "Home", $path: "/home.page" }),
  );

  nav.on.click = async (event) => {
    const target = event.target.closest(`[state-path]`);
    if (target) {
      event.preventDefault();
      router(target.$.path);
    }
    layout.close();
  };
};

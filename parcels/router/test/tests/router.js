/* 
/router.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async ({ router }) => {
  layout.clear();
  await router.setup("@/test/home.js");

  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    component.a("nav-link", { text: "About", $path: "/test/about" }),
    component.a("nav-link", { text: "Home", $path: "/test/home" })
  );


  nav.on.click = async (event) => {
    const target = event.target.closest(`[state-path]`);
    if (target) {
      event.preventDefault();

      // TODO Move active logic to router or nav group util


      const active = nav.find(`.active`)
      if (active) {
        active.classes.remove('active')
      }

      target.classes.add('active')




      router(`@${target.$.path}.js`);
    }
    layout.close();
  };
};

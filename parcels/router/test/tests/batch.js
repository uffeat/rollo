/* 
/batch.js
*/
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");
const { Sheet, css, rule, scope } = await use("@/sheet.js");
const { router } = await use("@/router.js");

const sheet = Sheet.create({
  ".nav-link": {
    fontSize: css.rem(1.125),
    cursor: "pointer",
  },

  ".nav-link.active": {
    fontWeight: 700,
  },
}).use();


/* Batch-register test routes. */
await (async () => {
  const START = "../assets".length;
  const entries = Object.entries({
    ...import.meta.glob("../assets/**/*.js"),
  });
  for (const [k, v] of entries) {
    router.routes.add({
      [`${k.slice(START, -3)}`]: async (...args) => {
        const mod = await v();
        mod.default(...args);
      },
    });
  }
})();



export default async ({ router }) => {
  layout.clear();




  /* Create nav */
    const nav = component.nav(
      "nav.d-flex.flex-column",
      { slot: "side", parent: layout },
      ...[
        
        ["About", "/about?thing=42&baz&pink=pong"],
       
      ].map(([text, path]) => component.a("nav-link", { text, $path: path }))
    );

    nav.on.click = async (event) => {
      const target = event.target.closest(`[state-path]`);
      if (target) {
        event.preventDefault();
        router(target.$.path);
      }
      //layout.close();
    };

    router.effects.path.add(
      (current, message) => {
        let active = nav.find(`.active`);
        if (active) {
          active.classes.remove("active");
        }
        active = nav.find(`[state-path="${current}"]`);
        if (active) {
          active.classes.add("active");
        }
      },
      (current) => !!current
    );

    

    /* Handle initial
    NOTE Do after complete setup */
    await router.setup();



};

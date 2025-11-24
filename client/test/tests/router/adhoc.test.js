/*
/router/adhoc.test.js
*/

/* Overload to use live parcel */
import * as parcel from "../../../../parcels/router/index.js";
use.add("@/router.js", parcel);

const { reactive, ref } = await use("@/state.js");
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

const { NavLink, router } = await use("@/router.js");



const base = "/test/test.html";

export default async () => {
  layout.clear();

  /* Define routes */
  router.routes.add({
    [base]: () => {},

    [`${base}/ding`]: await (async () => {
      const Page = (() => {
        let page;
        return () => {
          if (page) {
            return page;
          }
          page = component.main("container", component.h1({ text: "Ding" }));
          page.detail.queryOutput = component.output({
            parent: page,
            width: "100%",
          });
          page.detail.argsOutput = component.output({
            parent: page,
            width: "100%",
          });
          return page;
        };
      })();

      const states = {
        mode: ref(),
        query: reactive(),
        args: ref(),
      };

      /* Effect to control page display */
      states.mode.effects.add(
        (mode) => {
          const page = Page();
          //console.log("mode:", mode);////
          if (mode.enter) {
            layout.clear(":not([slot])");
            layout.append(page);
          } else if (mode.exit) {
            page.remove();
          }
        },
        { run: false }
      );

      /* Effect to control query display */
      states.query.effects.add(
        (query) => {
          const output = Page().detail.queryOutput;
          output.clear();
          //console.log("query:", query);////
          for (const [key, value] of Object.entries(query)) {
            output.append(
              component.p({ text: `Item: ${key}=${value}`, width: "100%" })
            );
          }
        },
        { run: false }
      );

      /* Effect to control args display */
      states.args.effects.add(
        (args) => {
          const output = Page().detail.argsOutput;
          output.clear();
          //console.log("args:", args);////
          for (const arg of args) {
            output.append(component.p({ text: `Arg: ${arg}`, width: "100%" }));
          }
        },
        { run: false }
      );

      return async (mode, query, ...args) => {
        //console.log("mode:", mode);////
        states.mode(mode);
        states.query(query);
        states.args(args);
      };
    })(),
  });

  /* Create nav */
  const nav = component.nav(
    "nav.d-flex.flex-column",
    { slot: "side", parent: layout },
    NavLink({ text: "Ding", path: `${base}/ding` }),
   
  );

  await router.setup({
    //strict: false,
  });


};

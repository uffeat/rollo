/*
/use/public/template.test.js
*/

import "@/use";
import { layout } from "@/layout/layout";

const { component, css } = await use("@/rollo");




export default async () => {
  layout.clear(":not([slot])");

  const container = component.main("container.mt-3", {
    parent: layout,
    ...css.display.flex,
    ...css.flexDirection.column,
    ...css.alignItems.end,
    innerHTML: await use("/test/foo.template")
  });

  
};

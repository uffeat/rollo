/*
/use/public/template.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { css } from "@/sheet/sheet.js";




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

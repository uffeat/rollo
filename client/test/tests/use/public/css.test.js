/*
/use/public/css.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";
import { Sheet, css, scope } from "@/sheet/sheet.js";

const sheet = await use("/test/bar.css", { as: "sheet" });

export default async () => {
  layout.clear(":not([slot])");

  const link = await use("/test/foo.css");
  sheet.use();

  const container = component.main(
    "container.mt-3",
    {
      parent: layout,
      ...css.display.flex,
      ...css.flexDirection.column,
      ...css.alignItems.end,
    },
    component.h1("foo.bar", { text: "Roll-oh!" })
  );

  /* Removes styles, so that other tests are not affected. */
  container.on._disconnect = (event) => {
    link.remove();
    sheet.unuse();
  };
};

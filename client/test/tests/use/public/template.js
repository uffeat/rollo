/*
use/public/template.js
*/

const { Sheet, css, scope } = await use("@/sheet.js");
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
 
  const container = component.main("container.mt-3", {
    parent: layout,
    ...css.display.flex,
    ...css.flexDirection.column,
    ...css.alignItems.end,
  });

  

  container.insert.beforeend(await use("/test/foo.template"));

 
};

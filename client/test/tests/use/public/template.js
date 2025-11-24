/*
/use/public/template.js
*/

const { css } = await use("@/sheet.js");
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

  const element = (await use("/test/foo.x.template"))();

  container.insert.beforeend(element);
};

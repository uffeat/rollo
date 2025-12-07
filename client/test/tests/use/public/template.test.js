/*
/use/public/template.test.js
*/

const { css } = await use("@/sheet");
const { component } = await use("@/component");
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

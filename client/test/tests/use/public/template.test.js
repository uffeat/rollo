/*
/use/public/template.test.js
*/

import "@/use";

const { component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const container = component.main("container.mt-3", {
    parent: frame,
    ...css.display.flex,
    ...css.flexDirection.column,
    ...css.alignItems.end,
    innerHTML: await use("/test/foo.template"),
  });
};

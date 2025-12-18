/*
/use/public/template.test.js
*/

import "@/use";

const { component, declare } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const container = component.main("container.mt-3", {
    parent: frame,
    ...declare.display.flex,
    ...declare.flexDirection.column,
    ...declare.alignItems.end,
    innerHTML: await use("/test/foo.template"),
  });
};

/*
/use/public/css.test.js
*/

const { component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const sheet = await use("/test/bar.css", { as: "sheet" });

export default async () => {
  frame.clear(":not([slot])");

  const link = await use("/test/foo.css");
  sheet.use();

  const container = component.main(
    "container.mt-3",
    {
      parent: frame,
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

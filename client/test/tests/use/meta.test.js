/*
/use/meta.test.js
*/
const { Sheet, css, scope } = await use("@/sheet");
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");

  console.log("@-paths:", await use("@/__paths__.json"));
  console.log("@@-paths:", await use("@@/__paths__.json"));
};

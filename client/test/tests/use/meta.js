/*
/use/meta.js
*/
const { Sheet, css, scope } = await use("@/sheet.js");
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");

  console.log("@-paths:", await use("@/__paths__.json"));
  console.log("@@-paths:", await use("@@/__paths__.json"));
};

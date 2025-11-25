/*
/reactive/filter.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing filter method'})

  const state = reactive({ foo: 42, bar: "BAR" }, (change, message) => {
    console.log("change:", change);
  });

  state.filter(([k, v]) => typeof v === "number");
};

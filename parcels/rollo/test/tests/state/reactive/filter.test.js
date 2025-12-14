/*
/state/reactive/filter.test.js
*/

const { reactive, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");


export default async () => {
  frame.clear(":not([slot])");

  component.h1({parent: frame, text: 'Testing filter method'})

  const state = reactive({ foo: 42, bar: "BAR" }, (change, message) => {
    console.log("change:", change);
  });

  state.filter(([k, v]) => typeof v === "number");
};

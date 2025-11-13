/*
reactive/filter.js
*/



const { layout } = await use("@//layout.js");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  const state = reactive({ foo: 42, bar: "BAR" }, (change, message) => {
    console.log("change:", change);
  });

  state.filter(([k, v]) => typeof v === 'number')
  


};

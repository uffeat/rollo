/*
reactive/map.js
*/



const { layout } = await use("@//layout.js");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  const state = reactive({ foo: 2, bar: 3 }, (change, message) => {
    console.log("change:", change);
  });

  state.map(([k, v]) => [k, 2*v])

  state.ding = 42

  console.log("Has ding:", 'ding' in state);


  


};

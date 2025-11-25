/*
/reactive/.test.js
*/


const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing map method'})

  const state = reactive({ foo: 2, bar: 3 }, (change, message) => {
    console.log("change:", change);
  });

  state.map(([k, v]) => [k, 2*v])

  state.ding = 42

  console.log("Has ding:", 'ding' in state);


  


};

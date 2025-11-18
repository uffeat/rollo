/*
/reactive/foreach.js
*/


const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async ({ reactive }) => {
  layout.clear(":not([slot])");

  component.h1({parent: layout, text: 'Testing forEach method'})

  const state = reactive({ foo: 2, bar: 3 });

  state.forEach(([k, v]) => console.log(`${k}:`, v))


  


};

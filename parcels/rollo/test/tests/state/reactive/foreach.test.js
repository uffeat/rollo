/*
/state/reactive/foreach.test.js
*/


const { reactive, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");


export default async () => {
  frame.clear(":not([slot])");

  component.h1({parent: frame, text: 'Testing forEach method'})

  const state = reactive({ foo: 2, bar: 3 });

  state.forEach(([k, v]) => console.log(`${k}:`, v))


  


};

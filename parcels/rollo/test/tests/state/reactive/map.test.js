/*
/state/reactive/map.test.js
*/



const { reactive, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  component.h1({parent: frame, text: 'Testing map method'})

  const state = reactive({ foo: 2, bar: 3 }, (change, message) => {
    console.log("change:", change);
  });

  state.map(([k, v]) => [k, 2*v])

  state.ding = 42

  console.log("Has ding:", 'ding' in state);


  


};

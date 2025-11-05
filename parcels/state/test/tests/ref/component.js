/*
ref/component.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");



export default async ({ RefComponent }) => {
  layout.clear(":not([slot])");
  const state = RefComponent({parent: layout})
  state.current = 42

  state.name='foo'
 


  


  
};

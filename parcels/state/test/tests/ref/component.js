/*
ref/component.js
*/
const { app } = await use("@//app.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");



export default async ({ RefComponent }) => {
  const state = RefComponent({parent: app, slot: 'data'})
  state.current = [1,2,3]

  state.name='foo'
  state.name='bar'


  


  
};

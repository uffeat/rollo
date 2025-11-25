/*
/classes.test.js
*/


const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });


  button.classes.add('text-3xl text-red-300 font-bold')
  //button.classes.add('text-red-300', 'font-bold')


  component.button("text-3xl text-red-300 font-bold foo", {
    text: "Button",
    parent: layout,
  });

   
  





  console.log("button:", button);
};

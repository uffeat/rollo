/*
/component/anvil.test.js
*/

const { Component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");

  const button = Component('button')("btn btn-primary", {
    text: "Button",
    parent: frame,
    text: 'Button'
  });

 
  console.log('button:', button)
  
};

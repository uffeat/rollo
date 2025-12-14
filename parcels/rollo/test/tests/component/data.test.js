/*
/component/data.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
    "data.foo": 42,
  });

  button.data.bar = true;
  button.data.ding = 'DING';
  button.data.ding = null


  console.log("button:", button);
  //console.log('foo:', button.dataset.foo)
  console.log("foo:", button.data.foo);
  console.log("bar:", button.data.bar);
  console.log("ding:", button.data.ding);
};

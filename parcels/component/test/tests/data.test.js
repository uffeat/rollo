/*
/data.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
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

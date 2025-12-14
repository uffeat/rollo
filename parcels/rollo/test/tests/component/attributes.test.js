/*
/component/attributes.test.js
*/

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: frame,
  });

  button.attribute.test = 0;

  button.attributes.update({
    'data-foo': 42
  })

  console.log('button:', button)
  console.log('foo:', button.dataset.foo)
};

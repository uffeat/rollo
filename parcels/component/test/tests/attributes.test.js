/*
/attributes.test.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");
  const button = component.button("btn.btn-success", {
    text: "Button",
    parent: layout,
  });

  button.attribute.test = 0;

  button.attributes.update({
    'data-foo': 42
  })

  console.log('button:', button)
  console.log('foo:', button.dataset.foo)
};

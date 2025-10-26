/*
foo.js
*/

export default async ({
  layout,
  author,
  Component,
  component,
  mix,
  mixins,
}) => {
   layout.clear(":not([slot])");
  

  Component("button.btn.btn-primary", {
    parent: layout,
    text: "Button",
  });

  const _mixins = Object.entries(mixins)
    .filter(([k, v]) => !["for_", "novalidation"].includes(k))
    .map(([k, v]) => v);
  console.log("_mixins:", _mixins);

  const Foo = author(
    class extends mix(HTMLElement, {}, ..._mixins) {},
    "x-foo"
  );

  const foo = Foo(
    "foo",
    {
      parent: layout,
      text: "Foo",
      padding: 1,
      border: "4px solid green",
    },
    component.button("foo", { text: "Button in foo" })
  );

  console.dir(foo);
};

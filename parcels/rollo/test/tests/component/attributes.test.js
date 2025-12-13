/*
/component/attributes.test.js
*/

import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";

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

/*
/basics.test.js
*/
const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { YAML } = await use("@/yaml");

export default async () => {
  frame.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: frame });

  const raw = `
---
title: Bevel
image: /images/bevel.jpg
abstract: Cardigan plaid roof party ex, fugiat nulla bitters small batch. Dreamcatcher shaman banh mi messenger bag, church-key consectetur lomo taiyaki. Glossier post-ironic cred sed aesthetic leggings, poutine quinoa dreamcatcher freegan et thundercats adaptogen.
created: 2024-05-09 17:25
---
  `;

  const result = YAML.parse(raw.trim().split("---")[1]);
  console.log("result:", result);
};

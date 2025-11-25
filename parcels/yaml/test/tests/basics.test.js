/*
basics.js
*/
const { component } = await use("@/component");
const { layout } = await use("@/layout/");
const { YAML } = await use("@/yaml");

export default async () => {
  layout.clear(":not([slot])");

  const page = component.div("container.p-3", { parent: layout });

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

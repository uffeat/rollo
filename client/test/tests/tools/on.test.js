/*
/tools/on.test.js
*/

import { on } from "../../../assets/tools/on.js";

const { component } = await use("@/component");
const { layout } = await use("@//layout");

export default async () => {
  layout.clear(":not([slot])");

   on(document).click((event) => console.log("Keep clickin'"));

  on(document, { once: true }).click((event) => console.log("Once from A..."));
  on(document, { once: true }).click.use((event) => console.log("Once from B..."));
  on(document, { once: true }).click = (event) => console.log("Once from C...");

  const handler = (event) => console.log("Should not show!");
  on(document, { once: true }).click.use(handler);
  on(document, { once: true }).click.unuse(handler);

 
};

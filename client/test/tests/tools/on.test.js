/*
/tools/on.test.js
*/

import { on } from "../../../assets/tools/on.js";

const { component } = await use("@/component");
const { layout } = await use("@//layout");

export default async () => {
  layout.clear(":not([slot])");

  on(document, { once: true }).click((event) => console.log("Clicked"));
  on(document, { once: true }).click.use((event) => console.log("Clicked"));
  on(document, { once: true }).click = (event) => console.log("Clicked");

  const handler = (event) => console.log("Clicked");
  on(document, { once: true }).click.use(handler);
  on(document, { once: true }).click.unuse(handler);

 
};

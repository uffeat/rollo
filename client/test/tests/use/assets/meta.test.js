/*
/use/assets/meta.test.js
*/

import "@/use.js";
client/test/tests/use/meta.test.js
import { layout } from "@/layout/layout.js";


export default async () => {
  layout.clear(":not([slot])");

  console.log("@-paths:", await use("@/__paths__.json"));

};

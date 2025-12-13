/*
/use/assets/meta.test.js
*/

import "@/use";

import { layout } from "@/layout/layout";


export default async () => {
  layout.clear(":not([slot])");

  console.log("@-paths:", await use("@/__paths__.json"));

};

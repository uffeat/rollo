/*
/use/meta.test.js
*/
import "@/use.js";
import { component } from "component";
import { layout } from "@/layout/layout.js";


export default async () => {
  layout.clear(":not([slot])");

  console.log("@-paths:", await use("@/__paths__.json"));

};

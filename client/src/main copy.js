/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
import { iworker } from "@/iworker";
/* Set up routes */
import "@/router";

import { InputFile } from "./tools";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

component.input("form-control", {
  type: "file",
  parent: frame,
  "on.change": async (event) => {
    const file = event.target.files[0];
    const dto = await InputFile.create(file).dto();
    const result = await iworker.pilot(dto);
    console.log("result:", result);
    /* { meta: {
      env: "development",
      name: "pilot",
      session_id: "J4NSRPCH3NSSCYPYVOBAHM7TAV42K6BK",
      submission: 2,
      type: "rpc",
    },
    result: { message: "'hi.txt' saved to db.", ok: true }, } */
  },
});

component.input("form-control", {
  type: "file",
  parent: frame,
  "on.change": async (event) => {
    const file = event.target.files[0];
    const json = await InputFile.create(file).json();
    const result = await iworker.pilot(json);
    console.log("result:", result);
  },
});

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

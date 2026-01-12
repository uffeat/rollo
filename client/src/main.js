/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/router";
import { server } from "@/server";

const { InputFile, app, component, is } = await use("@/rollo/");
const { frame } = await use("@/frame/");


component.input("form-control", {
  type: "file",
  parent: frame,
  "on.change": async (event) => {
    const file = event.target.files[0];
    const inputFile = InputFile.create(file);
    const json = await inputFile.json();
    //console.log("json:", json);////
    const result = await server.pilot({ file: json });
    console.log("result:", result); ////
  },
});

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

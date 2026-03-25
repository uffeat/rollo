/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await import("@/dev.css");
}



await (async () => {
  const { server } = await use("@/server");
  const { response, result, meta } = await server.echo({foo: 'FOO'}, 1,2,3);
  console.log("result:", result);
  console.log("meta:", meta);
})();





//const { user } = await use("@/user/");

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";
import Anvil from "@/anvil";



const { anvil } = await Anvil;

anvil.echo(42).then((data) => {
  console.log("data:", data);
});

/*



console.log('Loading...')
const { anvil, request } = await Anvil("https://rollohdev.anvil.app");
console.log('Loaded')


const { Exception, app, Sheet, component, element, css, typeName, is } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");
*/

/*
anvil.echo(42).then((data) => {
    console.log("data:", data);
  });

 try {
    await anvil.bad();
  } catch (error) {
    console.log("Error as expected:", error.message);
  }

  try {
    await anvil.noexist();
  } catch (error) {
    console.log("Error as expected:", error.message);
  }
    */

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

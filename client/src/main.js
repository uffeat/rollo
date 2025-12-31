/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

const { app, Sheet, component, element, css, typeName } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const anvil = component.iframe({src: '/test/anvil.html', slot: 'data'})
const {promise, resolve} = Promise.withResolvers()
anvil.on.load({once: true}, (event) => {
  resolve(anvil.contentWindow)
})
app.append(anvil)
const contentWindow = await promise
//console.log('contentWindow:', contentWindow)

window.addEventListener('message', (event) => {
  //console.log('event:', event)
  const data = event.data
  const source = event.source
  //console.log('source:', source)
})

contentWindow.postMessage({data: 42})



if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}

/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";
import router from "./router.js";

const { type } = await use("@/tools/type");

async function foo() {}
const bar = async () => {}

console.log(type(foo))
console.log(type(bar))


document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");
if (use.meta.DEV) {
  /* NOTE Rules in "/dev.css" should eventually be transferred to 
  "/client/assets/main.css" from where build tools will minify etc. */
  await use("/dev.css");
}

const { layout } = await use("@/layout/");
const { component } = await use("@/component");

/*
const default1 = await (await use("/pages/about.x.html")).default
console.log('result:', await default1())

const default2 = await (await use("/pages/about.x.html")).default
console.log('result:', await default2())

*/


//const {page} = await use("/pages/about.x.html")
//console.log('page:', page)
//layout.append(page)
//component.h1({parent: layout}, 'Test')



await router();




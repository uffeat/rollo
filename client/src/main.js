/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";
import router from "./router.js";

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


const _default = await (await use("/pages/about.x.html")).default
console.log('result:', await _default())

const _default2 = await (await use("/pages/about.x.html")).default
console.log('result:', await _default2())

//const {page} = await use("/pages/about.x.html")
//console.log('page:', page)
//layout.append(page)
//component.h1({parent: layout}, 'Test')



//await router();




/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";


const { layout } = await use("@//layout.js");
document.documentElement.dataset.bsTheme = "dark";
const { component } = await use("@/component.js");

const image = component.img({ src: "/images/engine.webp", parent: layout });

console.log("foo:", (await use("/test/foo.json")).foo);
console.log("foo:", (await use("/test/foo.json")).foo);



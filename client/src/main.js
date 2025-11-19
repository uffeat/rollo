/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

const { layout } = await use("@/layout/");
document.documentElement.dataset.bsTheme = "dark";
const { component } = await use("@/component.js");

//console.log((await use("@/component.js")).__path__)


const image = component.img({ src: "/images/engine.webp", parent: layout });


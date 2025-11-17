/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

const { layout } = await use("@/layout/");
document.documentElement.dataset.bsTheme = "dark";
const { component } = await use("@/component.js");

const image = component.img({ src: "/images/engine.webp", parent: layout });

const { d3 } = await use("@/d3.js");

console.log("d3:", d3);

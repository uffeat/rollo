/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use/use.js";



const { layout } = await use("@//layout.js");

document.documentElement.dataset.bsTheme = "dark";

const { component } = await use("@/component.js");

const image = component.img({ src: "/images/engine.webp", parent: layout });



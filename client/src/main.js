/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use/use.js";

document.querySelector("html").dataset.bsTheme = "dark";

const {component} = await use('/component.js')

const image = component.img({src: "/images/engine.webp", parent: document.body});







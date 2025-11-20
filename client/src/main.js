/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

const { layout } = await use("@/layout/");
document.documentElement.dataset.bsTheme = "dark";
const { component } = await use("@/component.js");

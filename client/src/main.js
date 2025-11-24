/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";

document.documentElement.dataset.bsTheme = "dark";

/* Load global sheets */
await use("/assets/bootstrap/main.css");
await use("/main.css");

const { layout } = await use("@/layout/");
const { component } = await use("@/component.js");

component.button('rounded bg-sky-500 foo',{ parent: layout, text: "Tester" });
component.button("btn.btn-primary", { parent: layout, text: "Tester" });

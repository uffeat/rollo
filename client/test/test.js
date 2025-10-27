/* Activate Tailwind */
import "../src/main.css"
/* Initialize import engine */
import "../src/use.js";

import {component} from '../../parcels/component/index.js'

component.h1({parent: document.body, text: "I'm a component"})



await use("/test/bar.css", document.head)
document.body.insertAdjacentText("afterbegin", (await use("/test/foo.js")).foo);
document.body.insertAdjacentHTML("afterbegin", await use("/test/foo.html"));
document.body.insertAdjacentText(
  "afterbegin",
  (await use("/test/foo.json")).foo
);

await use("/test/foo.css", document)

console.log("meta:", use.meta);
console.log("Sheet:", await use("/sheet.js"));


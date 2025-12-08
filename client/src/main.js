/* Initialize import engine */
import "./use.js";
/* Activate Tailwind */
import "./main.css";
/* Load Bootstrap sheet */
import "./bootstrap/bootstrap.css";

import { layout } from "./layout/layout.js";
import { component } from "./component/component.js";

const fooHtml = await use(`/test/foo.template`);
console.log("fooHtml:", fooHtml);

const fooSheet = await use(`/test/foo.css`, { as: "sheet" });
console.log("fooSheet:", fooSheet);
fooSheet.use();

layout.insert.afterbegin(fooHtml);

const button = component.button("btn.btn-primary", { parent: layout }, "Button");

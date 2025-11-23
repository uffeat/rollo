/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

//
//
import { createRoot } from "react-dom/client";
import { createElement } from "react";
//
//


const { layout } = await use("@/layout/");
const { component } = await use("@/component.js");

const { Foo } = await use("@@/components/foo.jsx");
const root = component.div({ parent: layout });
const reactRoot = createRoot(root);
reactRoot.render(createElement(Foo));

/* Initialize import engine */
import { Use } from "./use.js";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import "./index.css";
//import {App} from "./assets/App.jsx";

document.documentElement.dataset.bsTheme = "dark";

await Use("/assets/bootstrap/main.css");
await Use("/main.css");

const wrap = async (root) => {
  const { App } = await Use("@@/App.jsx");

  createRoot(root).render(
    <StrictMode>
      <App foo="FOO" root={root} />
    </StrictMode>
  );
};

const { component } = await Use("@/component");
const { layout } = await Use("@/layout/");

const container = component.div("container.d-flex.flex-column.align-items-center", { parent: layout });
const root = component.div({ parent: container });

root.$.effects.add(
  (current) => {
    console.log("count:", current.count);
  },
  { run: false },
  ["count"]
);

await wrap(root);

root.$.bump = 0;

const bumper = component.button("btn.btn-primary", { parent: container }, "Bump");
bumper.on.click = (event) => {
  root.$.bump++;
};



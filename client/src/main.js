/* Activate Tailwind */
import "./main.css";
/* Initialize import engine */
import "./use.js";

import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { Foo } from "./components/foo.jsx";

const { layout } = await use("@/layout/");
const { component } = await use("@/component.js");
const { reactive } = await use("@/state.js");

const state = reactive();

state.effects.add(
  ({ count }, message) => {
    console.log("count:", count);
  },
  { run: false }
);

const root = component.div({ parent: layout });
const reactRoot = createRoot(root);
reactRoot.render(createElement(Foo, { state }));

const wrapReact = (wrapper, reactComponent) => {
  const state = reactive();

  let reactRoot;

  wrapper.on._connect = (event) => {
    if (!reactRoot) {
      reactRoot = createRoot(root);
    }
    reactRoot.render(createElement(reactComponent, { state }));
  };

  wrapper.on._disconnect = (event) => {
    if (reactRoot) {
      reactRoot.unmount();
    }
  };

  return state;
};

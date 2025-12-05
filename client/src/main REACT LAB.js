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

// SEE SCRATCH! 

const wrapReact = (state, wrapper, reactComponent) => {
  let reactRoot
  
  if (wrapper.isConnected) {
    reactRoot = createRoot(wrapper);
    reactRoot.render(createElement(reactComponent, { state }));
  }

  wrapper.on._connect = (event) => {
    if (!reactRoot) {
      reactRoot = createRoot(wrapper);
    }
    reactRoot.render(createElement(reactComponent, { state }));
  };

  wrapper.on._disconnect = (event) => {
    if (reactRoot) {
      reactRoot.unmount();
      reactRoot = null;
    }
  };

  return state;
};

const state = reactive({ count: 0 });
const wrapper = component.div({ parent: layout });

wrapReact(state, wrapper, Foo);

state.effects.add(
  ({ count }, message) => {
    console.log("count:", count);
  },
  { run: false }
);

/* TODO
- Use the state already on the wrapper... 
*/

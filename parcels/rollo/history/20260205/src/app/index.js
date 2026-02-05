import { Mixins, author, component, mix } from "../component/index";
import { stateMixin } from "../state/index";

console.log('Creating app component')////

const TAG = "div";

const App = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(stateMixin)
  ) {
    #_ = {};
    constructor() {
      super();
      this.#_.slot = component.slot();
      this.#_.dataSlot = component.slot({ name: "data", display: null });
      this.#_.shadow = component.div(
        { id: "root" },
        this.#_.slot,
        this.#_.dataSlot
      );
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.attribute.app = true;
      this.attribute.webComponent = true;
    }
  },
  "app-component",////
  TAG
);

export const app = App({ id: "app", parent: document.body });

/* Breakpoints.
Not used by 'app' itself, but provided as a service to enable:
- Programmatic reaction to breakpoint crossings, either directly with '$' 
  effects or with '_break_' handlers.
- Alternative to media queries in sheets.

NOTE
Breakpoints follow Tailwind conventions, which are not identical to (but not far 
off) Bootstrap defaults:
{
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400, // Also different label
}
... Likely not an issue, just be aware.
*/
export const breakpoints = Object.freeze({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
});
for (const [key, value] of Object.entries(breakpoints)) {
  const query = window.matchMedia(`(width >= ${value}px)`);
  /* Handle initial */
  const match = query.matches;
  app.$[key] = match;
  app.send(`_break_${key}`, { detail: match });
  query.addEventListener("change", (event) => {
    const match = query.matches;
    app.$[key] = match;
    app.send(`_break_${key}`, { detail: match });
  });
}

/* Resize observer.
Not used by 'app' itself, but provided as a single general-purpose viewport 
resize observer that consuming code can access with '$' effects or with 
'_resize' handlers.

NOTE
Could have handled breakpoints (making a separate breakpoints util redundant),
but does not do that to maintain clear separation of concern and for ease of
maintenance. Also possible that breakpoint calculations inside the resize 
callback would hurt performance.
*/
const observer = new ResizeObserver((entries) => {
  /* HACK Wrap in 'setTimeout' to suppress Chromium warning. */
  setTimeout(() => {
    for (const entry of entries) {
      const X = entry.contentRect.width;
      const Y = entry.contentRect.height;
      /* NOTE 
      - Use uppercase to avoid collision with native style props, 'x' and 'y';
        translates to attrs: `state-x` and `state-y`.
      - Update state with function (batch) to minimize effect calls.
      */
      app.$({ X, Y });
    }
  }, 0);
});
observer.observe(app);
/* State -> event dispatch.
NOTE Send events from effect to avoid redundant sending of x/y-specific events.
*/
app.$.effects.add(
  (change) => {
    const { X, Y } = change;
    app.send("_resize");
    if (X !== undefined) {
      app.send("_resize_x", { detail: X });
    }
    if (Y !== undefined) {
      app.send("_resize_y", { detail: Y });
    }
  },
  ["X", "Y"]
);


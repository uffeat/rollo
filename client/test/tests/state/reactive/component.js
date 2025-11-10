/*
state/reactive/component.js
*/

import { ReactiveComponent } from "../../../../../parcels/state/index.js";

const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const reactiveComponent = ReactiveComponent({ parent: layout });
};
